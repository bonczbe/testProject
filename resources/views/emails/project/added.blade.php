<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Added</title>
</head>
<body>
    <p>Hello,</p>

    <p>A new project has been added:</p>

    <ul>
        <li><strong>Name:</strong> {{ $project->name }}</li>
        <li><strong>Description:</strong> {{ $project->desc }}</li>
        <li><strong>Status:</strong> {{ $project->status }}</li>
    </ul>
    <strong>If you are newly added to this website please make a "forgotten" password before try to log in!</strong>
    <p>Thank you!</p>
</body>
</html>
