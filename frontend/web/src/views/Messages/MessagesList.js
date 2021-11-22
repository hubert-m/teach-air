import React, {useState} from 'react';
import AsyncSelect from 'react-select/async';

const MessagesList = () => {
    const [loadOptions, setLoadOptions] = useState([]);

    const handleInputChange = (e) => {
        if(e.length >= 3) {
            // strzał do API i aktualizacja loadOptions
            console.log(123);
            setLoadOptions([{value: "-2", label: "Wpisz 3 znaki"}, {value: "-1", label: "asdasd"}]);
        }
    }

    return (
        <>
            <p>Do kogo chcesz napisać wiadomość? (wprowadź przynajmniej 3 znaki)</p>
            <AsyncSelect
                defaultOptions={loadOptions}
                placeholder="Wprowadź 3 znaki aby wyszukać użytkowników"
                onInputChange={handleInputChange}
            />
            <div className="jumbotron" style={{ marginTop: '50px' }}>
                <h1 className="display-7">Aktywne konwersacje</h1>
                <hr className="my-4"/>
            </div>
            <p>Brak</p>
        </>
    )
}

export default MessagesList;