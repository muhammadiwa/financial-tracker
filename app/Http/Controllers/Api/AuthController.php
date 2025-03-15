<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Google_Client;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'string', 'min:8'],
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ]);

            // Default categories will be created automatically via Observer

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Pendaftaran berhasil',
                'user' => $user,
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mendaftar: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($validatedData)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ]);
    }
    public function socialLogin(Request $request, $provider)
    {
        try {
            $socialToken = $request->input('access_token');
            $idToken = $request->input('id_token'); // Add support for ID token
            
            // Handle different token types
            if ($idToken && $provider === 'google') {
                // For Google Sign-In using ID tokens
                $payload = $this->verifyGoogleIdToken($idToken);
                if (!$payload) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid Google ID token'
                    ], 400);
                }
                
                $email = $payload['email'];
                $name = $payload['name'];
                $providerId = $payload['sub'];
                
            } else if ($socialToken) {
                // Traditional OAuth flow with access token
                $socialUser = Socialite::driver($provider)->stateless()->userFromToken($socialToken);
                $email = $socialUser->getEmail();
                $name = $socialUser->getName();
                $providerId = $socialUser->getId();
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No valid token provided'
                ], 400);
            }
            
            // Find user by email
            $user = User::where('email', $email)->first();
            
            // If user doesn't exist, create a new account
            if (!$user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make(Str::random(24)),
                    'provider' => $provider,
                    'provider_id' => $providerId,
                ]);
                
                // Create default categories for new user via Observer
            } else {
                // Update provider info if user exists but logged in with social for the first time
                if (!$user->provider) {
                    $user->provider = $provider;
                    $user->provider_id = $providerId;
                    $user->save();
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => $user->wasRecentlyCreated ? 'Akun baru dibuat' : 'Login berhasil',
                'user' => $user,
                'token' => $token
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Social login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
      * Verify Google ID token
      */
    private function verifyGoogleIdToken($idToken)
    {
        try {
            // Use Google API Client to verify the token
            $client = new \Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($idToken);
            
            if ($payload) {
                return $payload;
            }
            
            return null;
        } catch (\Exception $e) {
            \Log::error('Google ID token verification failed: ' . $e->getMessage());
            return null;
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil'
        ]);
    }

    public function googleLogin(Request $request)
    {
        try {
            \Log::info('Google login attempt', ['request' => $request->all()]);

            if (!$request->credential) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Credential tidak ditemukan'
                ], 400);
            }

            $client = new Google_Client();
            $client->setClientId(config('services.google.client_id'));
            
            try {
                $payload = $client->verifyIdToken($request->credential);
                
                if (!$payload) {
                    \Log::error('Invalid Google token');
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Token Google tidak valid'
                    ], 401);
                }

                \Log::info('Google payload', ['payload' => $payload]);

                // Get user info from payload
                $googleId = $payload['sub'];
                $email = $payload['email'];
                $name = $payload['name'];
                
                // Find or create user
                $user = User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => $name,
                        'google_id' => $googleId,
                        'email_verified_at' => now(),
                        'password' => bcrypt(Str::random(16))
                    ]
                );

                // Generate token
                $token = $user->createToken('auth-token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'message' => 'Login berhasil',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]);

            } catch (\Exception $e) {
                \Log::error('Google token verification error', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token Google tidak valid'
                ], 401);
            }

        } catch (\Exception $e) {
            \Log::error('Google login error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat login dengan Google'
            ], 500);
        }
    }
}
