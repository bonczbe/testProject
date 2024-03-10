import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, projects }) {
    const [projectList, setProjectList] = useState(projects.data);

    const handleDelete = async (project) => {
        try {
            const response = await fetch(route("projects.destroy", project), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const updatedProjects = projectList.filter(
                (item) => item.id !== project.id
            );
            setProjectList(updatedProjects);
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Index
                </h2>
            }
        >
            <Head title="Index" />

            <div className="py-12">
                <h3 className="text-lg font-semibold mb-4">Projects</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Status</th>
                                <th className="py-2 px-4">Contacts</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {projectList.map((project) => (
                                <tr key={project.id}>
                                    <td className="py-2 px-4">
                                        {project.name}
                                    </td>
                                    <td className="py-2 px-4">
                                        {project.status}
                                    </td>
                                    <td className="py-2 px-4">
                                        {project.contacts.length}
                                    </td>
                                    <td className="py-2 px-4">
                                        <Link
                                            href={route(
                                                "projects.show",
                                                project
                                            )}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Show
                                        </Link>
                                        <span className="mx-2">|</span>
                                        <Link
                                            href={route(
                                                "projects.edit",
                                                project
                                            )}
                                            className="text-yellow-500 hover:text-yellow-700"
                                        >
                                            Edit
                                        </Link>
                                        <span className="mx-2">|</span>
                                        <button
                                            onClick={() =>
                                                handleDelete(project)
                                            }
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <span className="mr-2">
                            Showing {projects.from}-{projects.to} of{" "}
                            {projects.total}
                        </span>
                    </div>
                    <div>
                        {projects.links.map((link, index) => (
                            <span key={index} className={"mx-2"}>
                                {link.active ? (
                                    <span className=" bg-slate-200 rounded-full px-2 py-1">
                                        {link.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={link.url}
                                        className={`${"text-blue-500 hover:text-blue-700"} ${
                                            link.label.includes("e")
                                                ? "mt-4 py-1 px-4 bg-gray-900 w-fit rounded"
                                                : "bg-slate-900 rounded-full px-2 py-1"
                                        }`}
                                    >
                                        {link.label
                                            .replace("&laquo;", "")
                                            .replace("&raquo;", "")}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
