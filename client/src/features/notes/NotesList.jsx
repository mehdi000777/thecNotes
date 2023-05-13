import React from 'react';
import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';
import useAuth from '../../hooks/useAuth';
import { PulseLoader } from 'react-spinners';

const NotesList = () => {
  const { username, isAdmin, isManager } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

  let content;

  if (isLoading) content = <PulseLoader color='#FFF'/>

  if (isError) content = <p className='errmsg'>{error?.data?.message}</p>

  if (isSuccess) {
    const { ids, entities } = notes;

    console.log(entities)

    let filteredIds
    if (isAdmin || isManager) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(noteId => entities[noteId].user.username === username);
    }

    const tableContent = filteredIds?.length && filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__status">Username</th>
            <th scope="col" className="table__th user__created">Created</th>
            <th scope="col" className="table__th user__updated">Updated</th>
            <th scope="col" className="table__th user__title">Title</th>
            <th scope="col" className="table__th user__username">Owner</th>
            <th scope="col" className="table__th user__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )

  }

  return content;
}

export default NotesList;