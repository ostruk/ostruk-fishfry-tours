function getColumnIndexFromName(name){
    switch(name){
      case "Docked":
        return 0;
      case "Outbound to Sea":
        return 1;
      case "Inbound to Harbor":
        return 2;
      case "Maintenance":
        return 3;
    }
  }

module.exports = {getColumnIndexFromName:getColumnIndexFromName}