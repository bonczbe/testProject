<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'desc', 'status'];

    public function contacts()
    {
        return $this->belongsToMany(User::class, 'project_contact_connects', 'project_id', 'contact_id')->withTimestamps();
    }
}
