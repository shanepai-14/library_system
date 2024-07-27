import React, {useState , useEffect} from 'react';
import AuthorTable from '../../Tables/DynamicTable';
import  api from '../../../Utils/interceptor';
import { getAuthors, deleteAuthors,updateAuthors ,booksAuthor } from '../../../Utils/endpoint';
import EditModal from '../../Modals/EditModal';
import CreateAuthorModal from '../../Modals/CreateModal';
import ViewModal from '../../Modals/ViewModal';
import Swal from 'sweetalert2';


const Authors = () => {
    const [page, setPage] = useState(1);
    const [authors, setAuthors] = useState([]);
    const [row , setRow] = useState(5);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState({ id : 0});
    

    useEffect(() => {
        fetchAuthors();
    }, [page, row, search]);

    const fetchAuthors = () => {
        setLoading(true);

      const params = {
        page: page,
        row: row,
        search: search,
      };

      api.get(getAuthors(), { params }).then((res) => {
        console.log(res);
        setAuthors(res.data);
        setTotal(res.data.total);
        setLoading(false);
      });
    };
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1); // Reset to first page on new search
      };
      const handleClose = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
      };
      const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
      };
    
      const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
      };
      const handleEdit = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
      };

      const handleCreate = (newAuthorData) => {
        setLoading(true);
        
        api.post(getAuthors(), newAuthorData)
          .then((res) => {
            console.log('Category created:', res.data);
            
            Swal.fire({
              title: 'Success!',
              text: 'New Author has been created.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            fetchAuthors(); // Refresh the list
          })
          .catch((error) => {
            console.error('Error creating Author :', error);
            
            Swal.fire({
              title: 'Error!',
              text: 'Failed to create Author . Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      };

      const handleSave = (editedData) => {
        setLoading(true);
        
        api.put(updateAuthors(editedData.id), editedData)
          .then((res) => {
            console.log('Author  updated:', res.data);
            
            // Show success message (you can use a toast notification or SweetAlert here)
            Swal.fire({
              title: 'Success!',
              text: 'Author  has been updated.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            // Refresh the categories list
            fetchAuthors();
          })
          .catch((error) => {
            console.error('Error updating Author :', error);
            
            // Show error message
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update Author . Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      };

      const handleDelete = (row) => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            api.delete(deleteAuthors(row.id)).then((res) => {
              fetchAuthors();
              Swal.fire(
                'Deleted!',
                'An Author has been deleted.',
                'success'
              );
            }).catch((error) => {
              Swal.fire(
                'Error!',
                'There was a problem deleting the an Author.',
                'error'
              );
            });
          }
        });
      };
      const viewOnClick = (row) => {
        console.log("View clicked", row);
        setViewData(row);
        setIsViewModalOpen(true);
      }
      const createableColumns = ["name"];
      const editableColumns = ["name"];  
    const authorHeader = [
        { headerName: "Name", align: "left", accessor: "name" },
        { headerName: "Created date", align: "left", accessor: "created_at" },
        { headerName: "Updated date", align: "left", accessor: "updated_at" },
      ];
    return (
        <>
         <AuthorTable
           createButtonTitle = "ADD AUTHOR"
           columnsData={authorHeader}
           data={authors.data ?? []}
           viewOnClick={viewOnClick}
           showDeleteBtn={true}
           showStatus={false}
           showEditBtn={true}
           showAllRows={false}
           showVIewIcon={false}
           deleteOnClick={() => {}}
           showLoading={loading}
           onSearch={(val) => {handleSearchChange(val) }}
           rowsPerPage={row}
           rowPageCount={total}
           currentPage={page}
            setRowsPerPage={(e) => setRow(e)}
             setChangePage={(e) => setPage(e)}
             marginTop={"2px"}
             setDeleteOnClick={(row) => {handleDelete(row)}}
             setEditOnClick={(row) => {handleEdit(row)}}
             handleOpenCreateModal={handleOpenCreateModal}
         
         
         />
      {selectedRow && (
            <EditModal
            title="Edit Author"
              editableColumns={editableColumns}
                open={isModalOpen}
                handleClose={handleClose}
                rowData={selectedRow}
                handleSave={handleSave}
            />
            )}

      
      <CreateAuthorModal
        title="Create a new author"
        open={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleCreate={handleCreate}
        createableColumns={createableColumns}
      />

        <ViewModal
        title="Author"
        open={isViewModalOpen}
        handleClose={() => setIsViewModalOpen(false)}
        viewData={viewData}
        url={booksAuthor}
      />
        </>
    )
}

export default Authors