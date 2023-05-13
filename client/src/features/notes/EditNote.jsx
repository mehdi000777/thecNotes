import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';
import { PulseLoader } from 'react-spinners';
import useAuth from '../../hooks/useAuth';

const EditNote = () => {
  const { id } = useParams();

  const { username, isAdmin, isManager } = useAuth();

  const { note } = useGetNotesQuery('notesList', {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id]
    })
  })

  const { users } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    })
  })

  if (!note || !users.length) return <PulseLoader color='#FFF' />

  if ((!isAdmin && !isManager)) {
    if (username !== note.user.username) {
      return <p className='errmsg'>No access</p>
    }
  }

  const content = <EditNoteForm users={users} note={note} />

  return content;
}

export default EditNote;