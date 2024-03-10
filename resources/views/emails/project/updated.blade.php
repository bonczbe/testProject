<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Updated</title>
</head>
<body>
    <h1>Project Updated</h1>

    <p>The following changes have been made to the project:</p>

    <ul>
        @foreach ($changedData as $key => $value)
            <li>{{ ucfirst($key) }}: {{ $value }}</li>
        @endforeach
    </ul>

    <p>You can view the updated project details <a href="{{ route('projects.show', ['project' => $project->id]) }}">here</a>.</p>
</body>
</html>
