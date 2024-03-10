<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Controllers\Controller;
use App\Mail\ProjectDeleted;
use App\Mail\ProjectUpdated;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with('contacts')->paginate(10);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Projects/New');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'desc' => 'required|string',
            'status' => 'required|in:fejlesztésre vár,folyamatban,kész',
            'contacts' => 'required|array',
            'contacts.*.email' => 'required|email',
            'contacts.*.name' => 'required|string',
        ]);
        $project = Project::create([
            'name' => $validatedData['name'],
            'desc' => $validatedData['desc'],
            'status' => $validatedData['status'],
        ]);

        foreach ($validatedData['contacts'] as $userData) {
            $user = User::firstOrCreate(['email' => $userData['email']], [
                'name' => $userData['name'],
                'password' => Hash::make(Str::random(10)),
            ]);

            $project->contacts()->attach($user->id);
            if (!$user->hasVerifiedEmail()) {
                $user->sendEmailVerificationNotification();
            }
        }

        return "Project is added!";
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $project->load('contacts');

        // Return Inertia view with the project and its contacts
        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $project->load('contacts');
        return Inertia::render('Projects/Edit', [
            'project' => $project
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'desc' => 'required|string',
            'status' => 'required|in:fejlesztésre vár,folyamatban,kész',
            'contacts' => 'required|array',
            'contacts.*.email' => 'required|email',
            'contacts.*.name' => 'required|string',
        ]);

        $oldData = $project->only(['name', 'desc', 'status']);

        $project->update([
            'name' => $validatedData['name'],
            'desc' => $validatedData['desc'],
            'status' => $validatedData['status'],
        ]);

        $newData = $project->only(['name', 'desc', 'status']);

        $removedContacts = $project->contacts()
            ->whereNotIn('contact_id', collect($validatedData['contacts'])->pluck('id'))
            ->get();

        $project->contacts()->detach($removedContacts->pluck('id'));

        foreach ($validatedData['contacts'] as $userData) {
            $user = User::firstOrCreate(['email' => $userData['email']], [
                'name' => $userData['name'],
                'password' => Hash::make(Str::random(10)),
            ]);

            if (!$project->contacts()->where('contact_id', $user->id)->exists()) {
                $project->contacts()->attach($user->id);
            }
        }

        $changedData = collect($oldData)->diffAssoc($newData)->all();

        if (!empty($changedData)) {
            $contactsEmails = $project->contacts->pluck('email')->toArray();
            Mail::to($contactsEmails)->send(new ProjectUpdated($project, $changedData));
        }

        return "Edit was successfully made!";
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $contactsEmails = $project->contacts->pluck('email')->toArray();

        Mail::to($contactsEmails)->send(new ProjectDeleted($project));
        $project->delete();

        return "Destroy was successfully made!";
    }
}
