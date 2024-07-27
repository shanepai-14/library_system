import React, {useState , useEffect} from 'react';
import DataTable from '../../Tables/DynamicTable';
import  api from '../../../Utils/interceptor';
import { getBooks, deleteBooks,updateBooks } from '../../../Utils/endpoint';
import EditModal from '../../Modals/EditModal';
import CreateModal from '../../Modals/CreateModal';
import { tableHeader } from '../../../Utils/helper';
import Swal from 'sweetalert2';


const Books = () => {
    const [page, setPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [row , setRow] = useState(5);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    


    useEffect(() => {
        fetchTableData();
    }, [page, row, search]);

    const fetchTableData = () => {
        setLoading(true);

      const params = {
        page: page,
        row: row,
        search: search,
      };

      api.get(getBooks(), { params }).then((res) => {

        const transformedData = res.data.data.map(item => {
            return {
                ...item,
                author: item.author ? item.author.name : '',
                category: item.category? item.category.name : '',
            };
        });

         setBooks(transformedData);
        console.log(transformedData);
        
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

      const handleCreate = (newData) => {
        setLoading(true);
        console.log(newData)
        const formData = new FormData();

        Object.keys(newData).forEach(key => {
            if (key !== 'image') {
              formData.append(key, newData[key]);
            }
          });
          
          // Append the image file last
          if (newData.image) {
            formData.append('image', newData.image, newData.image.name);
          }

        api.post(getBooks(), formData,{  
            headers: {
            'Content-Type': 'multipart/form-data'
          }})
          .then((res) => {
            console.log('Category created:', res.data);
            
            Swal.fire({
              title: 'Success!',
              text: 'New Book has been created.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            fetchTableData(); // Refresh the list
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
        const formData = new FormData();
         console.log(editedData);
        // Append all other fields
        Object.keys(editedData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, editedData[key]);
          }
        });

        if (editedData.image) {
            if (editedData.image instanceof Blob) {
              // If it's already a Blob (File is a type of Blob)
              formData.append('image', editedData.image, editedData.image.name);
            } else if (typeof editedData.image === 'string') {
              // If it's a string (likely a URL or path), we don't need to append it
              // The backend will keep the existing image
            } else {
              // If it's neither a Blob nor a string, we have unexpected data
              console.error('Unexpected image data type:', typeof editedData.image);
            }
          }

          formData.append('_method', 'PUT');
          console.log(formData);
        api.post(updateBooks(editedData.id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        })
          .then((res) => {
            console.log('Author  updated:', res.data);
            
            // Show success message (you can use a toast notification or SweetAlert here)
            Swal.fire({
              title: 'Success!',
              text: 'Book  has been updated.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            // Refresh the categories list
            fetchTableData();
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
            api.delete(deleteBooks(row.id)).then((res) => {
              fetchTableData();
              Swal.fire(
                'Deleted!',
                'An Book has been deleted.',
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

      const createableColumns = ["title","book_price","total_copies","isbn","publication_year","author_id","category_id","image"];
      const editableColumns = ["title","book_price","total_copies","isbn","publication_year","author_id","category_id","image",];  

    return (
        <>
         <DataTable
           createButtonTitle = "ADD BOOK"
           columnsData={tableHeader}
           data={books ?? []}
        //    viewOnClick={viewUser}
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
              title="Edit Book"
              editableColumns={editableColumns}
                open={isModalOpen}
                handleClose={handleClose}
                rowData={selectedRow}
                handleSave={handleSave}
            />
            )}

      
      <CreateModal
        title="Add a new Book"
        open={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleCreate={handleCreate}
        createableColumns={createableColumns}
      />
        </>
    )
}

export default Books