import React, {useState , useEffect} from 'react';
import DataTable from '../../Tables/DynamicTable';
import  api from '../../../Utils/interceptor';
import { getAttendance, deleteBooks,updateBooks ,activeBookLoans} from '../../../Utils/endpoint';
import EditModal from '../../Modals/EditModal';
import CreateModal from '../../Modals/CreateModal';
import { tableHeader } from '../../../Utils/helper';
import Swal from 'sweetalert2';
import ViewModal from '../../Modals/ViewModal';
import LibraryAnalyticsDashboard from '../../Charts/LibraryAnalyticsDashboard';
import DailyAttendanceChart from '../../Charts/DailyAttendanceChart';
import MonthlyAttendanceChart from '../../Charts/MonthlyAttendanceChart';
import WeeklyAttendanceChart from '../../Charts/WeeklyAttendanceChart';
import { Grid } from '@mui/material';

const AttendancePage = () => {
    const [page, setPage] = useState(1);
    const [attendance, setAttendance] = useState([]);
    const [row , setRow] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState({ id : 0});
    


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

      api.get(getAttendance(), { params }).then((res) => {

        const transformedData = res.data.data.map(item => {
            return {
                ...item,
                id_number: item.user ? item.user.id_number : '',
                name: item.user? `${item.user.first_name} ${item.user.last_name}` : '',
                course_year : item.user ? `${item.user.course} ${item.user.year_level}` : '', 

            };
        });

        setAttendance(transformedData);
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

    

      const handleEdit = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
      };

      const handleCreate = (newData) => {
        setLoading(true);
   
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

        api.post(updateBooks(editedData.id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        })
          .then((res) => {
  
            
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

      const viewOnClick = (row) => {

        setViewData(row);
        setIsViewModalOpen(true);
  
      }


      const editableColumns = ["title","book_price","total_copies","isbn","publication_year","author_id","category_id","image",];  
      const AttendanceHeader = [
        { headerName: "User ID", align: "left", accessor: "id_number" },
        { headerName: "Name", align: "left", accessor: "name" },
        { headerName: "Course and Year", align: "left", accessor: "course_year" },
        { headerName: "Log Date", align: "left", accessor: "created_at" },
        { headerName: "Check IN", align: "left", accessor: "check_in" },
        { headerName: "Check OUT", align: "left", accessor: "check_out" },
        { headerName: "Purpose", align: "left", accessor: "notes" },
      ]; 
    return (
        <>
        <LibraryAnalyticsDashboard/>
        <Grid container spacing={2} sx={{ mb:3}}>
          <Grid item xs={12} md={6}>
            <DailyAttendanceChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <WeeklyAttendanceChart />
          </Grid>
        </Grid>
         <MonthlyAttendanceChart /> 

         <DataTable
           columnsData={AttendanceHeader}
           data={attendance ?? []}
           viewOnClick={viewOnClick}
           showStatus={false}
           showAllRows={true}
           showVIewIcon={false}
           showLoading={loading}
           onSearch={(val) => {handleSearchChange(val) }}
           rowsPerPage={row}
           rowPageCount={total}
           currentPage={page}
           setRowsPerPage={(e) => setRow(e)}
            setChangePage={(e) => setPage(e)}
            marginTop={"2px"}
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

      


          {/* <ViewModal
        title="Book"
        open={isViewModalOpen}
        handleClose={() => setIsViewModalOpen(false)}
        viewData={viewData}
        url={activeBookLoans}
        tableHeader={BookLoanHeader}
      /> */}
        </>
    )
}

export default AttendancePage