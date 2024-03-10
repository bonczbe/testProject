<?php
namespace App\Mail;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProjectUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $project;
    public $changedData;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Project $project, $changedData)
    {
        $this->project = $project;
        $this->changedData = $changedData;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Project Updated')->view('emails.project.updated');
    }
}
