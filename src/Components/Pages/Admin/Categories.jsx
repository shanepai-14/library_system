import React, {useState , useEffect} from 'react';
import CategoryTable from '../../Tables/DynamicTable';
import  api from '../../../Utils/interceptor';
import { getCategories, deleteCategories,updateCategory, booksCategory } from '../../../Utils/endpoint';
import EditModal from '../../Modals/EditModal';
import CreateCategoryModal from '../../Modals/CreateModal';
import Swal from 'sweetalert2';
import ViewModal from '../../Modals/ViewModal';
import { tableHeader } from '../../../Utils/helper';

const Categories = () => {
    const [page, setPage] = useState(1);
    const [categories, setCategories] = useState([]);
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
        fetchCategories();
    }, [page, row, search]);

    const fetchCategories = () => {
        setLoading(true);

      const params = {
        page: page,
        row: row,
        search: search,
      };

      api.get(getCategories(), { params }).then((res) => {
        console.log(res);
        setCategories(res.data);
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

      const handleCreate = (newCategoryData) => {
        setLoading(true);
        
        api.post(getCategories(), newCategoryData)
          .then((res) => {
            console.log('Category created:', res.data);
            
            Swal.fire({
              title: 'Success!',
              text: 'New category has been created.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            fetchCategories(); // Refresh the list
          })
          .catch((error) => {
            console.error('Error creating category:', error);
            
            Swal.fire({
              title: 'Error!',
              text: 'Failed to create category. Please try again.',
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
        
        api.put(updateCategory(editedData.id), editedData)
          .then((res) => {
            console.log('Category updated:', res.data);
            
            // Show success message (you can use a toast notification or SweetAlert here)
            Swal.fire({
              title: 'Success!',
              text: 'Category has been updated.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            
            // Refresh the categories list
            fetchCategories();
          })
          .catch((error) => {
            console.error('Error updating category:', error);
            
            // Show error message
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update category. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      };

      const viewOnClick = (row) => {
        console.log("View clicked", row);
        setViewData(row);
        setIsViewModalOpen(true);
      }
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
            api.delete(deleteCategories(row.id)).then((res) => {
              fetchCategories();
              Swal.fire(
                'Deleted!',
                'Your category has been deleted.',
                'success'
              );
            }).catch((error) => {
              Swal.fire(
                'Error!',
                'There was a problem deleting the category.',
                'error'
              );
            });
          }
        });
      };

      const createableColumns = ["name", "description", "status"];
      const editableColumns = ["name", "description", "status"];  
    const categoryHeader = [
        { headerName: "Name", align: "left", accessor: "name" },
        { headerName: "Status", align: "left", accessor: "status" },
      ];
    return (
        <>
         <CategoryTable
         createButtonTitle={'ADD CATEGORY'}
           columnsData={categoryHeader}
           data={categories.data ?? []}
           viewOnClick={viewOnClick }
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
            title="Edit Category"
              editableColumns={editableColumns}
                open={isModalOpen}
                handleClose={handleClose}
                rowData={selectedRow}
                handleSave={handleSave}
            />
            )}

      
      <CreateCategoryModal
        title="Create Category"
        open={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleCreate={handleCreate}
        createableColumns={createableColumns}
      />
      <ViewModal
      title={'Category'}
        open={isViewModalOpen}
        handleClose={() => setIsViewModalOpen(false)}
        viewData={viewData}
        url={booksCategory}
        tableHeader={tableHeader}
      />

        </>
    )
}

export default Categories