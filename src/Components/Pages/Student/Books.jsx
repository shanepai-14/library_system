import React, { useState } from 'react';
import { useQuery, } from '@tanstack/react-query';
import DataTable from '../../Tables/DynamicTable';
import api from '../../../Utils/interceptor';
import { getBooks } from '../../../Utils/endpoint';
import { tableHeader } from '../../../Utils/helper';
import Swal from 'sweetalert2';


const Books = () => {

    const [page, setPage] = useState(1);
    const [row, setRow] = useState(5);
    const [search, setSearch] = useState('');


    

    // Main query for fetching books
    const { 
        data: booksData, 
        isLoading,
        isError,
        error 
    } = useQuery({
        queryKey: ['books', page, row, search],
        queryFn: async () => {
            const response = await api.get(getBooks(), { 
                params: { page, row, search } 
            });
            
            // Transform the data
            const transformedData = response.data.data.map(item => ({
                ...item,
                author: item.author ? item.author.name : '',
                category: item.category ? item.category.name : '',
                shelve_no: item.category ? item.category.shelve_no : '',
            }));

            return {
                data: transformedData,
                total: response.data.total
            };
        },
    });



    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };







    // Error handling for main query
    if (isError) {
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to fetch books',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

   


    return (
        <>
            <DataTable
                columnsData={tableHeader}
                data={booksData?.data ?? []}
                showDeleteBtn={false}
                viewOnClick={()=> []}
                showStatus={false}
                showEditBtn={false}
                showAllRows={false}
                showVIewIcon={false}
                deleteOnClick={() => { }}
                showLoading={isLoading}
                onSearch={handleSearchChange}
                rowsPerPage={row}
                rowPageCount={booksData?.total ?? 0}
                currentPage={page}
                setRowsPerPage={setRow}
                setChangePage={setPage}
                marginTop={"2px"}
                setEditOnClick={(row) => {
                    setSelectedRow(row);
                    setIsModalOpen(true);
                }}
                handleOpenCreateModal={() => setIsCreateModalOpen(true)}
            />

       




        </>
    );
};

export default Books;