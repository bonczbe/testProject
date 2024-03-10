import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function New({ auth }) {
    const [formData, setFormData] = useState({
        name: '',
        desc: '',
        status: '',
        contacts: [{ email: '', name: '' }]
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(route('users.index'));
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...formData.contacts];
        list[index][name] = value;
        setFormData(prevState => ({
            ...prevState,
            contacts: list
        }));
    };

    const handleAddContact = () => {
        setFormData(prevState => ({
            ...prevState,
            contacts: [...prevState.contacts, { email: '', name: '' }]
        }));
    };

    const handleRemoveContact = index => {
        const hasFilledContact = formData.contacts.some(contact => contact.email && contact.name);

        const isCompletelyFilled = formData.contacts[index].email && formData.contacts[index].name;

        if (formData.contacts.length === 1 || !isCompletelyFilled || !hasFilledContact) {
            return;
        }

        const list = [...formData.contacts];
        list.splice(index, 1);
        setFormData(prevState => ({
            ...prevState,
            contacts: list
        }));
    };

    const handleContactEmailChange = (e, index) => {
        const { value } = e.target;
        const user = users.find(user => user.email === value);
        const name = user ? user.name : '';
        handleChange({ target: { name: 'name', value } }, index);
        handleChange({ target: { name: 'email', value } }, index);
        handleChange({ target: { name: 'name', value: name } }, index);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch(route('projects.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            window.location.href = route('projects.show', { project: data.project.id });
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">New Project</h2>}
        >
            <Head title="New Project" />

            <div className="py-12">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
                            Description
                        </label>
                        <textarea
                            id="desc"
                            name="desc"
                            value={formData.desc}
                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select status</option>
                            <option value="fejlesztésre vár">Fejlesztésre vár</option>
                            <option value="folyamatban">Folyamatban</option>
                            <option value="kész">Kész</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Contacts</label>
                        {formData.contacts.map((contact, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={contact.email}
                                    onChange={e => handleContactEmailChange(e, index)}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Email"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    value={contact.name}
                                    onChange={e => handleChange(e, index)}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                                    placeholder="Name"
                                />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveContact(index)}
                                        className="text-sm text-red-500 ml-2 focus:outline-none"
                                    >
                                        Remove
                                    </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddContact}
                            className="text-sm text-green-500 focus:outline-none"
                        >
                            Add Contact
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
