import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CircleIcon from "@mui/icons-material/Circle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Chip } from '@mui/material';
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import { useZxing } from "react-zxing";
import {
  alpha,
  CircularProgress,
  Divider,
  Grid,
  InputBase,
  Toolbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import { formatDate } from "../../Utils/helper";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#000000", 0.08),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));




const renderCellContent = (accessor, value) => {
  switch (accessor) {
    case "isbn":
      return value ? (
        <Barcode value={value} width={1} height={30} />
      ) : (
        "No ISBN"
      );
    case  "actual_return_date" :
      return value ? value : "Not returned" 
    case "created_at":
    case "updated_at":
    case "due_date":
    case "loan_date":
      return formatDate(value);
    case "status":
      return (
        <Chip 
          label={value} 
          color={getStatusColor(value)}
          size="small"
        />
      );
    default:
      return value;
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'returned':
      return 'success';
    case 'overdue':
      return 'error';
    case 'on loan':
      return 'primary';
    case 'scheduled':
      return 'warning';
    case 'inactive':
      return 'error'; 
    case 'active':
      return 'success';   
    default:
      return 'default';
  }
};


const TableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        pb: 0,
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onKeyDown={(e) => {
            if (e.code === "Enter" && props.onSearch)
              props.onSearch(e.target.value);
          }}
        />
      </Search>
      <Grid container justifyContent={"right"}>
        
        {props.createButtonTitle && (
          <Button onClick={props.handleOpenCreateModal} variant="contained">
            {props.createButtonTitle}
          </Button>
        )}
      </Grid>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export const DataPage = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage ?? 5);

  const [width, setWidth] = React.useState(null);
  const paperRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(paperRef.current.clientWidth);
    };

    if (paperRef.current) {
      setWidth(paperRef.current.clientWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [paperRef]);

  React.useEffect(() => {
    setPage(0);
  }, [props.currentYear]);

  React.useEffect(() => {
    if (props.currentPage === 1) {
      setPage(0);
    }
  }, [props.currentPage]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

  const handleChangePage = (event, newPage) => {
    if (props.setChangePage) {
      props.setChangePage(newPage + 1);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    if (props.setRowsPerPage) {
      props.setRowsPerPage(
        parseInt(event.target.value, 10) > 0
          ? parseInt(event.target.value, 10)
          : props.rowPageCount
      );
    }
    if (props.setChangePage) {
      props.setChangePage(1);
    }

    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      ref={paperRef}
      sx={{
        width: "100%",
        overflow: "hidden",
        mt: props.marginTop,
        mb: props.marginBottom,
      }}
    >
      <Divider />
      <TableToolbar numSelected={0} onSearch={props.onSearch} handleOpenCreateModal={props.handleOpenCreateModal} createButtonTitle={props.createButtonTitle} />
      <TableContainer sx={{ maxWidth: `${width - 10}px` }}>
        <Table aria-label="custom pagination table">
          <TableHead>
        
            {!props.showLoading && (
              <TableRow>
               

                {props.columnsData &&
                  props.columnsData.map((data) => {
                    return (
                      <TableCell
                        key={data.headerName}
                        style={{ fontWeight: "bold" }}
                        align={data.align}
                      >
                        {data.headerName}
                      </TableCell>
                    );
                  })}
                {(props.showStatus ||
                  props.showVIewIcon ||
                  props.showEditBtn) && (
                  <TableCell style={{ fontWeight: "bold" }} align="center">
                    {props.showStatus ? "Actief" : ""}
                    {props.showVIewIcon ? "Actie" : ""}
                    {props.showEditBtn ? "Action" : ""}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {props.data &&
              !props.showLoading &&
              (props.rowsPerPage > 0
                ? props.data
                : props.data.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
              ).map((row, index) => (
                <TableRow
                  key={index + Math.random()}
                  sx={{
                    "&:hover .MuiTableCell-root, &:hover .material-icons-outlined":
                      {
                        color: props.isBlue ? "blue" : "inherit",
                        cursor: "pointer",
                      },
                  }}
                >
                

              {props.columnsData.map((access, index) => {
                const getCellValue = Object.entries(row).find(
                  (e) => e[0] === Object.values(access)[2]
                )?.[1];
                
                return (
                  <TableCell
                    key={index + Math.random()}
                    align={access.align}
                    component="th"
                    scope="row"
                    onClick={() => props.viewOnClick(row)}
                  >
                    {renderCellContent(access.accessor, getCellValue)}
                  </TableCell>
                );
              })}

                  {props.showVIewIcon && (
                    <TableCell>
                      <Grid
                        item
                        xs={
                          props.showDeleteBtn || props.actions
                            ? props.actions?.xs ?? 6
                            : 12
                        }
                      >
                        <Button
                          fullWidth
                          onClick={() => props.viewOnClick(row)}
                          variant="text"
                          size="small"
                          startIcon={<RemoveRedEyeIcon />}
                        />
                      </Grid>
                    </TableCell>
                  )}

                  {(props.showDownloadBtn ||
                    props.showEditBtn ||
                    props.showDeleteBtn ||
                    props.showAddUserButton ||
                    props.showStatus ||
                    props.actions) && (
                    <TableCell
                      style={{
                        width: props.actions
                          ? props.actions.width
                          : props.showDeleteBtn
                          ? 100
                          : 100,
                      }}
                      align="right"
                    >
                      <Grid container spacing={1} justifyContent={"center"}>
                        {props.showDownloadBtn && (
                          <Grid
                            item
                            xs={
                              props.showDownloadBtn || props.actions
                                ? props.actions?.xs ?? 6
                                : 12
                            }
                          >
                            <Button
                              fullWidth
                              onClick={() => props.viewOnClick(row)}
                              variant="text"
                              size="small"
                              startIcon={<DownloadIcon />}
                            />
                          </Grid>
                        )}
                        {props.showEditBtn && (
                          <Grid item xs={props.actions ? 1 : 5}>
                            <EditIcon
                              color="primary"
                              onClick={() => props.setEditOnClick(row)}
                            />
                          </Grid>
                        )}
                        {props.showDeleteBtn && (
                          <Grid item xs={props.actions ? 1 : 1}>
                            <DeleteIcon
                              color="primary"
                              onClick={() => props.setDeleteOnClick(row)}
                            />
                          </Grid>
                        )}
                        {props.showAddUserButton && (
                          <Grid item xs={props.actions ? 4 : 6}>
                            <Button
                              fullWidth
                              onClick={() => props.viewOnClick(row)}
                              variant="contained"
                              size="small"
                              startIcon={<PersonAddIcon />}
                            >
                              Add
                            </Button>
                          </Grid>
                        )}
                        {props.showStatus &&
                          (row.is_active ? (
                            <Button
                              fullWidth
                              variant="text"
                              size="small"
                              startIcon={<CircleIcon />}
                              sx={{ color: "green" }}
                            ></Button>
                          ) : (
                            <Button
                              fullWidth
                              variant="text"
                              size="small"
                              startIcon={<CircleIcon />}
                              sx={{ color: "red" }}
                            ></Button>
                          ))}
                        {props.actions &&
                          props.actions.buttons.map((button, index) =>
                            button.buildButton(row) ? (
                              <Grid key={index} item xs={props.actions.xs}>
                                {button.buildButton(row)}
                              </Grid>
                            ) : (
                              <div key={index}></div>
                            )
                          )}
                      </Grid>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            {props.setChangePage
              ? null
              : emptyRows > 0 &&
                !props.showLoading && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
            {props.showLoading && (
              <TableRow>
                <TableCell colSpan={12}>
                  <Grid container spacing={2} sx={{ pt: "18px", pb: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <CircularProgress style={{ color: "#0d1c8a" }} />
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {!props.showLoading && (
            <TableFooter>
             

              {!props.isHidePagination && (
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      ...(props.showAllRows === undefined ||
                      props.showAllRows === true
                        ? [
                            {
                              label: "All",
                              value:
                                props.rowPageCount === undefined
                                  ? props.data.length
                                  : props.rowPageCount,
                            },
                          ]
                        : []),
                    ]}
                    colSpan={props.columnsData.length + 1}
                    count={props.rowPageCount ?? props.data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              )}
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Paper>
  );
};

DataPage.defaultProps = {
  marginTop: "30px",
  marginBottom: "30px",
  showEditBtn: false,
  showDeleteBtn: false,
  showLoading: false,
  minWidth: "500px",
};

export default DataPage;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
