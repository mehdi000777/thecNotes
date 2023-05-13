import React, { useEffect, useState } from 'react';
import { useAddNewNoteMutation } from './notesApiSlice';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const NewNoteForm = ({ users }) => {
    const [addNewNote,
        {
            isLoading,
            isSuccess,
            isError,
            error
        }] = useAddNewNoteMutation();

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [user, setUser] = useState(users[0]?.id);

    useEffect(() => {
        if (isSuccess) {
            setTitle('');
            setText('');
            setUser('');
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])

    const onChangeTitle = (e) => setTitle(e.target.value);
    const onChangeText = (e) => setText(e.target.value);
    const onChangeUser = (e) => setUser(e.target.value);

    const options = users.map(user => (
        <option key={user.id} value={user.id}>{user.username}</option>
    ))

    const onSaveNoteClicked = async (e) => {
        e.preventDefault();

        if (canSave) {
            await addNewNote({ userId: user, title, text });
        }
    }

    const canSave = [title, text, user].every(Boolean) && !isLoading;

    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''


    return (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveNoteClicked}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onChangeTitle}
                />

                <label className="form__label" htmlFor="password">
                    Text:</label>
                <input
                    className={`form__input ${validTextClass}`}
                    id="text"
                    name="text"
                    type="text"
                    value={text}
                    onChange={onChangeText}
                />

                <label className="form__label" htmlFor="roles">
                    User:</label>
                <select
                    id="user"
                    name="user"
                    className={`form__select`}
                    value={user}
                    onChange={onChangeUser}
                >
                    {options}
                </select>

            </form>
        </>
    )
}

export default NewNoteForm;