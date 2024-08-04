import React, {useState , useEffect} from 'react';
import DataTable from '../../Tables/DynamicTable';
import  api from '../../../Utils/interceptor';
import { getBooksLoans} from '../../../Utils/endpoint';
import { useAuth } from '../../Auth/AuthContext.jsx';
import dayjs from 'dayjs';

const IssuedBooks = () => {
    const { userData } = useAuth();
    const [page, setPage] = useState(1);
    const [books, setBooks] = useState([]);
    const [row , setRow] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading,setLoading] = useState(false);

    


    useEffect(() => {
        fetchTableData();
    }, [page, row, search]);

    const fetchTableData = () => {
        setLoading(true);
    
        const params = {
          page: page,
          row: row,
          search: search,
          user_id: userData.id,
        };
    
        api.get(getBooksLoans(), { params }).then((res) => {
          const transformedData = res.data.data.map((item) => {
            let transformedItem = {
              ...item,
              book: item.book ? item.book.title : "",
              user: item.user
                ? `${item.user.first_name} ${item.user.last_name}`
                : "",
              isbn: item.book ? item.book.isbn : "",
            };
    
            // Calculate status based on due_date and loan_date
            const currentDate = dayjs();
            const dueDate = dayjs(item.due_date);
            const loanDate = dayjs(item.loan_date);
    
          // Calculate status based on due_date, loan_date, and actual_return_date


                if (item.actual_return_date) {
                transformedItem.status = "Returned";
                } else if (currentDate.isAfter(dueDate)) {
                transformedItem.status = "Overdue";
                } else if (currentDate.isBefore(loanDate)) {
                transformedItem.status = "Scheduled";
                } else {
                transformedItem.status = "On Loan";
                }
    
            return transformedItem;
          });
    
          setBooks(transformedData);
          console.log(res);
    
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

    






      const viewOnClick = (row) => {

        setViewData(row);
        setIsViewModalOpen(true);
  
      }


   
      const tableHeader = [
        { headerName: "ID", align: "left", accessor: "id" },
        { headerName: "Book Name", align: "left", accessor: "book" },
        { headerName: "ISBN", align: "left", accessor: "isbn" },
        { headerName: "Issue Date", align: "left", accessor: "loan_date" },
        { headerName: "Due date", align: "left", accessor: "due_date" },
        {
          headerName: "Returned date",
          align: "left",
          accessor: "actual_return_date",
        },
        { headerName: "Status", align: "left", accessor: "status" },
      ]; 
    return (
        <>
         <DataTable
           columnsData={tableHeader}
           data={books ?? []}
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
        </>
    )
}

export default IssuedBooks 