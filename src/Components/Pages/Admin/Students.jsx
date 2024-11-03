import React, {useState , useEffect} from 'react';
import DataTable from '../../Tables/DynamicTable';
import  api from '../../../Utils/interceptor';
import { getUsers, deactivateStudent} from '../../../Utils/endpoint';
import UserPasswordRecovery from '../../Modals/UserPasswordRecovery';
import Swal from 'sweetalert2';


const Students = () => {
    const [page, setPage] = useState(1);
    const [students, setStudents] = useState([]);
    const [row , setRow] = useState(5);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading,setLoading] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState('');
    

    useEffect(() => {
     console.log(viewData.id);
  }, [viewData]);

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

      api.get(getUsers(), { params }).then((res) => {
      console.log(res);
        const transformedData = res.data.data.map(item => {
            return {
                ...item,
                student_name: item.first_name ? `${item.first_name} ${item.last_name}` : '',
                course_year: item.course ? `${item.course} ${item.year_level}` : '',
            };
        });

        setStudents(transformedData);
        setTotal(res.data.total);
        setLoading(false);
      });
    };
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1); // Reset to first page on new search
      };

      const handleDelete = (row) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "The student will be deactivated",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(deactivateStudent(row.id))
                    .then((res) => {
                        fetchTableData();
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The student has been deactivated.',
                            icon: 'success',
                            timer: 1500
                        });
                    })
                    .catch((error) => {
                        console.error('Delete error:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: error.response?.data?.message || 'There was a problem deleting the student.',
                            icon: 'error'
                        });
                    });
            }
        });
    };

    

      const viewOnClick = (row) => {

        setViewData(row);
        setIsViewModalOpen(true);
  
      }

      const StudentHeader = [
        { headerName: "ID Number", align: "left", accessor: "id_number" },
        { headerName: "Avatar", align: "left", accessor: "profile_picture" },
        { headerName: "Student Name", align: "left", accessor: "student_name" },
        { headerName: "Mobile Number", align: "left", accessor: "contact_number" },
        { headerName: "Course and Year", align: "left", accessor: "course_year" },
        { headerName: "Registration Date", align: "left", accessor: "created_at" },
      ]; 
    return (
        <>
         <DataTable
           columnsData={StudentHeader}
           data={students ?? []}
           viewOnClick={viewOnClick}
           showStatus={false}
           showAllRows={false}
           showVIewIcon={true}
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
           showDeleteBtn={true}

         />

    

        <UserPasswordRecovery
        open={isViewModalOpen}
        handleClose={() => setIsViewModalOpen(false)}
        userId={viewData.id}
      />
        </>
    )
}

export default Students