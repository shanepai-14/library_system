


export const capitalizeFirstLetter = (string) => {
  if (!string) return ''; // Handle empty string case
  
  const words = string.replace(/_/g, ' ').split(' ');
  
  const capitalizedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return capitalizedWords.join(' ');
};

export const formatDate = (dateString,includeWeekday = true) => {
    const date = new Date(dateString);
    const options = { weekday:  includeWeekday ? 'long' : undefined, year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }



 export  const getInputType = (key) => {
    switch (key) {
      case "total_copies":
        return 'number';
      case "book_price" :
        return 'number';
      case "isbn" :
          return 'number';
      case "publication_year" :
        return 'number';
 
      default:
        return 'text';
    }
  };

 export  const tableHeader = [
  { headerName: "Title", align: "left", accessor: "title" },
  { headerName: "ISBN", align: "left", accessor: "isbn" },
  { headerName: "Category", align: "left", accessor: "category" },
  { headerName: "Author", align: "left", accessor: "author" },
  { headerName: "Published year", align: "left", accessor: "publication_year" },
  { headerName: "Price", align: "left", accessor: "book_price" },
  { headerName: "Total Copies", align: "left", accessor: "total_copies" },
  { headerName: "Available Copies", align: "left", accessor: "available_copies" },
]; 