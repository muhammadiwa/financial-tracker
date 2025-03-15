<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getSettings()
    {
        $user = auth()->user();
        return response()->json([
            'status' => 'success',
            'data' => [
                'enabled' => $user->notification_enabled,
                'time' => $user->notification_time
            ]
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'enabled' => 'required|boolean',
            'time' => 'required',
        ]);

        // Format time to ensure it has seconds
        $time = strlen($request->time) === 5 
            ? $request->time . ':00' 
            : $request->time;

        if (!preg_match('/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/', $time)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Format waktu tidak valid',
                'errors' => [
                    'time' => ['Format waktu tidak valid']
                ]
            ], 422);
        }

        $user = auth()->user();
        $user->update([
            'notification_enabled' => $request->enabled,
            'notification_time' => $time
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan notifikasi berhasil diperbarui',
            'data' => [
                'enabled' => $user->notification_enabled,
                'time' => $user->notification_time
            ]
        ]);
    }

    public function getNotifications()
    {
        $notifications = auth()->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->data['title'],
                    'message' => $notification->data['message'],
                    'type' => $notification->data['type'],
                    'date' => $notification->created_at->format('Y-m-d H:i:s'),
                    'read' => !is_null($notification->read_at)
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $notifications
        ]);
    }

    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi ditandai sebagai telah dibaca'
        ]);
    }
}