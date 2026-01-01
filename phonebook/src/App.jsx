import { useState, useEffect } from 'react';
import personService from './services/person';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Fetch initial data from JSON server
  useEffect(() => {
    personService.getAll().then(setPersons);
  }, []);

  // Display a notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Add or update a person
  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      // Confirm updating number
      if (window.confirm(`${newName} is already added. Replace the old number?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            showNotification(`Updated number for ${returnedPerson.name}`, 'success');
          })
          .catch(() => {
            // 404 error: person deleted in another browser
            showNotification(`Information of ${existingPerson.name} has already been removed`, 'error');
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          showNotification(`Added ${returnedPerson.name}`, 'success');
        })
        .catch(() => {
          showNotification('Failed to add person', 'error');
        });
    }

    setNewName('');
    setNewNumber('');
  };

  // Delete a person
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          showNotification(`Deleted ${name}`, 'success');
        })
        .catch(() => {
          showNotification(`Information of ${name} has already been removed`, 'error');
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  // Filtered list for search
  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} setFilter={setFilter} />
      
      <h3>Add a new</h3>
      <PersonForm
        newName={newName} setNewName={setNewName}
        newNumber={newNumber} setNewNumber={setNewNumber}
        addPerson={addPerson}
      />
      
      <h3>Numbers</h3>
      <Persons
        persons={filteredPersons}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
