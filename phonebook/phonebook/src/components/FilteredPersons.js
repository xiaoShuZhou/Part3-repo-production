import React from "react";

const FilteredPersons = ({ filteredPersons, deletePerson }) => {
    return (
        <div>
        {filteredPersons.map(person => <p key={person.name}>{person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button></p>)}
      </div>
    );
    };

export default FilteredPersons;
