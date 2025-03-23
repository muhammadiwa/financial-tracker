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
use Illuminate\Auth\Events\PasswordReset;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Password as PasswordBroker;  // Update the import

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
            
            if (!$socialToken) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Access token tidak ditemukan'
                ], 400);
            }

            $socialUser = Socialite::driver($provider)->stateless()->userFromToken($socialToken);
            
            // Cari atau buat user baru
            $user = User::updateOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'name' => $socialUser->getName(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'password' => Hash::make(Str::random(24))
                ]
            );

            // Generate token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'user' => $user,
                'token' => $token
            ]);

        } catch (\Exception $e) {
            \Log::error('Social login error:', [
                'provider' => $provider,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal login dengan ' . ucfirst($provider)
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

    public function forgotPassword(Request $request)
    {
        \Log::info('Forgot password attempt', ['email' => $request->email]);

        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        try {
            $user = User::where('email', $request->email)->first();
            
            // Generate token
            $token = PasswordBroker::createToken($user);
            
            // Send notification with token and email
            $user->notify(new ResetPasswordNotification($token, $user->email));

            \Log::info('Reset password link sent', [
                'email' => $request->email
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Link reset password telah dikirim ke email Anda'
            ]);

        } catch (\Exception $e) {
            \Log::error('Forgot password error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim email reset password'
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        \Log::info('Reset password attempt', $request->all());
        
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        try {
            // Use PasswordBroker instead of Password
            $status = PasswordBroker::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();

                    event(new PasswordReset($user));

                    // Revoke all tokens
                    $user->tokens()->delete();
                }
            );

            \Log::info('Reset password status', ['status' => $status]);

            if ($status === PasswordBroker::PASSWORD_RESET) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Password berhasil direset'
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => trans($status)
            ], 400);

        } catch (\Exception $e) {
            \Log::error('Reset password error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mereset password'
            ], 500);
        }
    }
}
