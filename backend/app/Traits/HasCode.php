<?php

namespace App\Traits;

trait HasCode
{
    public static function bootHasCode()
    {
        static::creating(function ($model) {
            if (empty($model->code)) {
                // Generate code unik berdasarkan name
                $model->code = static::generateUniqueCode($model->name);
            }
        });
    }

    // Method untuk generate kode unik
    public static function generateUniqueCode($name)
    {
        // Ambil 4 huruf pertama dari name (uppercase)
        $prefix = strtoupper(substr($name, 0, 4));

        // Cek jika name kurang dari 4 huruf
        if (strlen($prefix) < 4) {
            $prefix = str_pad($prefix, 4, 'X'); // Jika kurang, tambahkan 'X'
        }

        // Generate nomor unik, bisa berupa timestamp atau random number
        $uniqueNumber = self::getUniqueNumber();

        // Gabungkan prefix dan nomor unik
        return $prefix . '-' . $uniqueNumber;
    }

    // Method untuk generate nomor unik (misalnya menggunakan timestamp atau counter)
    public static function getUniqueNumber()
    {
        // Contoh: Menggunakan timestamp atau bisa juga menggunakan random number
        return time(); // Atau bisa menggunakan random_int(1000, 9999);
    }
}
