const DonationService = {
   filterService: (list, searchTerm) => {
     if (!searchTerm) return list;
     
     return list.filter((item) =>
       item.donationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.location.toLowerCase().includes(searchTerm.toLowerCase())
     );
   }
 };
 
 export default DonationService;
 