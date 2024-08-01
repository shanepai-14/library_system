import React, {useState ,useEffect} from 'react';
import { Modal, Box, Typography, Button ,Grid } from '@mui/material';
import DataTable from '../Tables/DynamicTable'
import api from '../../Utils/interceptor';
import dayjs from 'dayjs';
const ViewModal = ({ open, handleClose,  viewData , url ,title , tableHeader }) => {

    const [page, setPage] = useState(1);
    const [row , setRow] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true);

  
    useEffect(() => {
       if(viewData.id) fetchData(viewData.id);
    }, [page, row, search,viewData.id]);

    const fetchData = (id) => {
        setLoading(true);
        const params = {
            page: page,
            row: row,
            search: search,
          };
    
          api.get(url(id), { params }).then((res) => {
      
            if(res.data.message === "No books found in this category"){
                alert('No books found in this category')
                setBooks([]);
                setTotal(0);
                setLoading(false);
                return;

            } 

            if(res.data.message === "No active loans found for this book."){
              alert('No active loans found for this book.')
              setBooks([]);
              setTotal(0);
              setLoading(false);
              return;

          } 
          
          const transformedData = res.data.data.map(item => {
            let transformedItem = { ...item };
            if (title === "Author") {
                transformedItem.author = item.author ? item.author.name : '';
                transformedItem.category = item.category ? item.category.name : '';
            } else if (title === "Book") {
                transformedItem.user = item.user ? `${item.user.first_name} ${item.user.last_name}` : '';
                transformedItem.book = item.book ? item.book.title : '';
                transformedItem.isbn = item.book ? item.book.isbn: '';
                // Calculate status based on due_date and loan_date
                const currentDate = dayjs();
                const dueDate = dayjs(item.due_date);
                const loanDate = dayjs(item.loan_date);
                
                if (item.actual_return_date) {
                    transformedItem.status = 'Returned';
                } else if (currentDate.isAfter(dueDate)) {
                    transformedItem.status = 'Overdue';
                } else if (currentDate.isAfter(loanDate) || currentDate.isSame(loanDate)) {
                    if (currentDate.isBefore(dueDate) || currentDate.isSame(dueDate)) {
                        transformedItem.status = 'On Loan';
                    } else {
                        transformedItem.status = 'Overdue';
                    }
                } else if (currentDate.isBefore(loanDate)) {
                    transformedItem.status = 'Scheduled';
                } else {
                    transformedItem.status = 'Unknown';
                }
            }
            return transformedItem;
        });
            setBooks(transformedData);
            setTotal(res.data.total);
            setLoading(false);
          });

    }
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1); // Reset to first page on new search
      };
   
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            {  `${title}  ${title == "Book" ? viewData.title : viewData.name}`  }
          </Typography>
          <DataTable
          
           columnsData={tableHeader}
           data={books ?? []}
           showDeleteBtn={false}
           showStatus={false}
           showEditBtn={false}
           showAllRows={false}
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
        <Grid container justifyContent={"space-between"} sx={{marginTop:'20px'}}>
        <Typography id="edit-modal-title" variant="h6" component="h2">
            Total { total}
          </Typography>
          <Button variant="contained"   onClick={handleClose}>Close</Button>
          </Grid>
        </Box>
      </Modal>
    );
  };

  export default ViewModal;

 