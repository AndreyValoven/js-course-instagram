module.exports = (email) => {
    if(typeof email === 'string') {
        let reg = new RegExp('/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/');
        if(reg.test(email)){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
