import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, project }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Project Details" />

            <div className="py-12 flex justify-center items-center">
                <div className="w-full max-w-md text-center">
                    <h3 className="text-lg font-semibold mb-4">
                        {project.name}
                    </h3>
                    <p className="mb-4">Description: {project.desc}</p>
                    <p className="mb-4">Status: {project.status}</p>
                    <div className="border border-gray-400 rounded-md p-4">
                        <h4 className="text-lg font-semibold mb-2">Contacts</h4>
                        <ul className="list-disc pl-4">
                            {project.contacts.map((contact) => (
                                <li key={contact.id} className="mb-2">
                                    <span className="font-semibold">
                                        {contact.name}
                                    </span>{" "}
                                    - {contact.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link
                        href={route("projects.edit", project)}
                        className="text-blue-500 hover:text-blue-700 block mt-4 py-2 px-5 bg-gray-900 w-fit rounded mx-auto"
                    >
                        Edit
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
