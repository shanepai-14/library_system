import React, {useState ,useEffect} from 'react';
import { Modal, Box, Typography, Button, TextField ,Grid,  Switch, FormControlLabel} from '@mui/material';
import DataTable from '../Tables/DynamicTable'
import api from '../../Utils/interceptor';
import { tableHeader } from '../../Utils/helper';

const ViewDetailsModal = ({ open, handleClose,  viewData , url ,title  }) => {

    const [page, setPage] = useState(1);
    const [row , setRow] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true);

  
    useEffect(() => {
       if(viewData.id) fetchBooks(viewData.id);
    }, [page, row, search,viewData.id]);

    const fetchBooks = (id) => {
        setLoading(true);
        const params = {
            page: page,
            row: row,
            search: search,
          };
    
          api.get(url(id), { params }).then((res) => {
            console.log(res);

            if(res.data.message === "No books found in this category"){
                alert('No books found in this category')
                setBooks([]);
                setTotal(0);
                setLoading(false);
                return;

            } 
            const transformedData = res.data.data.map(item => {
                return {
                    ...item,
                    author: item.author ? item.author.name : '',
                    category: item.category? item.category.name : '',
                };
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
            {  `${title}  ${viewData.name}`  }
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

  export default ViewDetailsModal;

 