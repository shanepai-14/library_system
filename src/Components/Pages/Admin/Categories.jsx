import React, { useState, useEffect } from "react";
import CategoryTable from "../../Tables/DynamicTable";
import api from "../../../Utils/interceptor";
import {
  getCategories,
  deleteCategories,
  updateCategory,
  booksCategory,
} from "../../../Utils/endpoint";
import EditModal from "../../Modals/EditModal";
import CreateCategoryModal from "../../Modals/CreateModal";
import Swal from "sweetalert2";
import ViewModal from "../../Modals/ViewModal";
import { tableHeader } from "../../../Utils/helper";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Categories = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [row, setRow] = useState(5);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState({ id: 0 });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', page, row, search],
    queryFn: () => api.get(getCategories(), { 
      params: { page, row, search } 
    }).then(res => res.data),
  })

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
    createMutation.mutate(newCategoryData);
  };

  const createMutation = useMutation({
    mutationFn: (newCategoryData) => api.post(getCategories(), newCategoryData),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      Swal.fire({
        title: "Success!",
        text: "New category has been created.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to create category. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleSave = (editedData) => {
    updateMutation.mutate(editedData);
  };

  const updateMutation = useMutation({
    mutationFn: (editedData) => api.put(updateCategory(editedData.id), editedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      Swal.fire({
        title: "Success!",
        text: "Category has been updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to update category. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const viewOnClick = (row) => {
    console.log("View clicked", row);
    setViewData(row);
    setIsViewModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(deleteCategories(id)),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      Swal.fire("Deleted!", "Your category has been deleted.", "success");
    },
    onError: () => {
      Swal.fire(
        "Error!",
        "There was a problem deleting the category.",
        "error"
      );
    },
  });

const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(row.id);
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
        createButtonTitle={"ADD CATEGORY"}
        columnsData={categoryHeader}
        data={categories?.data ?? []}
        viewOnClick={viewOnClick}
        showDeleteBtn={true}
        showStatus={false}
        showEditBtn={true}
        showAllRows={false}
        showVIewIcon={false}
        deleteOnClick={() => {}}
        showLoading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
        onSearch={(val) => {
          handleSearchChange(val);
        }}
        rowsPerPage={row}
        rowPageCount={categories?.total ?? 0}
        currentPage={page}
        setRowsPerPage={(e) => setRow(e)}
        setChangePage={(e) => setPage(e)}
        marginTop={"2px"}
        setDeleteOnClick={(row) => {
          handleDelete(row);
        }}
        setEditOnClick={(row) => {
          handleEdit(row);
        }}
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
        title={"Category"}
        open={isViewModalOpen}
        handleClose={() => setIsViewModalOpen(false)}
        viewData={viewData}
        url={booksCategory}
        tableHeader={tableHeader}
      />
    </>
  );
};

export default Categories;
