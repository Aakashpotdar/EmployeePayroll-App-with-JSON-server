let isUpdate=false;
let employeePayrollObj;
window.addEventListener('DOMContentLoaded',(event)=>{
    const name=document.querySelector("#name");
    const textError=document.querySelector('.text-error');
    name.addEventListener('input',function(){
        if(name.value.length==0){
            textError.textContent=" ";
            return;
        }
        try{
            checkName(name.value);
            textError.textContent="ok";
        }catch(e){
            textError.textContent=e;
        }
    
});
    const date=document.querySelector('#date');
    date.addEventListener('input',function(){
        const startDate=new Date(Date.parse(getInputValueById('#day')+" "+
                                            getInputValueById('#month')+" "+
                                            getInputValueById('#year')));

        try{
            checkStartDate(new Date(Date.parse(startDate)));
            textError.textContent=" ";}
        catch(e){
            textError.textContent=e;        }
    });

    const salary=document.querySelector("#salary");
    const output=document.querySelector('.salary-output');
    output.textContent=salary.value;
    salary.addEventListener('input',function(){
    output.textContent=salary.value;
    document.querySelector('#cancleButton').href=site_Properties.home_Page;
    checkForUpdate();
    });
});

const save=(event)=>{
    event.preventDefault();
    event.stopPropagation();
    try{
        setEmployeePayrollObject();
        // createAndUpdateStorage();
        // resetForm();
        if(site_Properties.use_local_storage.match("true")){
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_Properties.home_Page);
        }else{
            createOrUpdateEmployeePayroll();
        }
    // try{
    //     let newemployeePayrollData= creatEmployeePayrollData();
    //     createAndUpdateStorage(newemployeePayrollData);      
    }catch(e){
        return;
    }
}

const remove=(node)=>{
    let employeeData=empPayrollList.find(emp=>emp.id==node.id);
    if(!employeeData) return;
    const index=empPayrollList
                .map(emp=>employeeData.id)
                .indexOf(employeeData.id);
    empPayrollList.splice(index,1);
    if(site_Properties.use_local_storage.match("true")){
        localStorage.setItem("EmployeePayrollList",JSON.stringify(empPayrollList));
        createInnerHtml();
    }else{
        const deleteURL=site_Properties.server_url+employeeData.id.toString();
        makeServiceCall("DELETE",deleteURL,false)
        .then(responseText=>{
            createInnerHtml();
        })
        .catch(error=>{
            console.log("Delete error statue:"+JSON.stringify(error));
        });
    }
}

const setEmployeePayrollObject=()=>{
    if(!isUpdate) employeePayrollObj.id=creatNewEmployeeId();
    employeePayrollObj._name=getInputValueById('#name');
    employeePayrollObj._profilePic=getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender=getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department=getSelectedValues('[name=department]');
    employeePayrollObj._salary=getSelectedValues('#salary');
    employeePayrollObj._note=getSelectedValues('#notes');
    let date=getInputValueById('#day')+" "+getInputValueById('#month')+" "+getInputValueById('#year');
    employeePayrollObj._startDate=date;
}

const createOrUpdateEmployeePayroll=()=>{
    let postUrl=site_Properties.server_url;
    let methodCall="POST";
    if(isUpdate){
        methodCall="PUT";
        postUrl=postUrl+employeePayrollObj.id.toString();
    }
    makeServiceCall(methodCall,postUrl,true,employeePayrollObj)
    .then(responseText=>{
        resetForm();
        window.location.replace(site_Properties.home_Page);
    })
    .catch(error=>{
        throw error;
    });
}

const createAndUpdateStorage=()=>{
    let employeepayrollList=JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeepayrollList){
        let employeePayRollData=employeepayrollList.find(emp=>emp.id==employeePayrollObj.id);
        if(!employeePayRollData){
            employeepayrollList.push(employeePayrollObj);
        }
        else{
            const index=employeepayrollList
                        .map(emp=>emp.id)
                        .indexOf(employeePayRollData.id);
            employeepayrollList.splice(index,1,createEmployeePayroll(employeePayrollObj));
        }
    }
    else{
            employeepayrollList=[employeePayrollObj];
    }
    alter(employeepayrollList.toString());
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeepayrollList))
}

const creatEmployeePayrollData=(id)=>{
    let newemployeePayrollData= new newEmployeePayrollData();
    if(!id) newemployeePayrollData.id=creatNewEmployeeId();
    else newemployeePayrollData.id=id;
    setEmployeePayrollData(newemployeePayrollData);
    return newemployeePayrollData;
}

const setEmployeePayrollData=(EmployeepayrollData)=>{
    try{
        EmployeepayrollData.name=employeePayrollObj._name;
    }catch(e){
        setTextValue('.text-error',e);
        throw e;
    }
    EmployeepayrollData.profilePic=employeePayrollObj._profilePic;
    EmployeepayrollData.gender=employeePayrollObj._gender;
    EmployeepayrollData.department=employeePayrollObj._department;
    EmployeepayrollData.salary=employeePayrollObj._salary;
    EmployeepayrollData.note=employeePayrollObj._note;
    try{
        EmployeepayrollData.startDate=new Date(Date.parse(employeePayrollObj._startDate));
    }catch(e){
        setTextValue('.date-error',e);
        throw e;
    }
    alert(EmployeepayrollData.toString());
}

const creatNewEmployeeId=()=>{
    let employeeId=localStorage.getItem("EmployeeId");
    employeeId=!employeeId?1:(parseInt(employeeId)+1).toString();
    localStorage.setItem("EMPLOYEE Id",employeeId);
    return employeeId;
}

const getSelectedValues=(propertyValue)=>{
    let allitems=document.querySelectorAll(propertyValue);
    let selItem=[];
    allitems.forEach(item=>{
        if(item.checked) selItem.push(item.value);
    });
    return selItem;
}

const getInputValueById=(id) => {
    let value=document.querySelector(id).value;
    return value;
}

const resetForm=()=>{
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day','1');
    setValue('#month','January');
    setValue('#year','2021');
}

const unsetSelectedValues=(propertyValue)=>{
    let allitems=document.querySelectorAll(propertyValue);
    allitems.forEach(item=>{
        item.checked=false;
    });
}

const setValue=(id,value)=>{
    const element=document.querySelector(id);
    element.value=value;
}

const checkForUpdate=()=>{
    const employeePayrollJson=localStorage.getItem('editEmp')
    isUpdate=employeePayrollJson ? true:false;
    if(!isUpdate)return;
    employeePayrollObj=JSON.parse(employeePayrollJson);
    setForm();
}

const setForm=()=>{
    setValue('#name',employeePayrollObj._name);
    setSelectedValues('[name=profile]',employeePayrollObj._prfilePic);
    setSelectedValues('[name=gender]',employeePayrollObj._gender);
    setSelectedValues('[name=department]',employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    setTextValue('.salary-output',employeePayrollObj._salary)
    setValue('#notes',employeePayrollObj._note);
    let date=stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day',day[0]);
    setValue('#month',day[1]);
    setValue('#year',day[2]);
}

const setSelectedValues=(propertyValue,value)=>{
    let allitems=document.querySelectorAll(propertyValue);
    allitems.forEach(item=>{
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked=true;
            }
            else if(item.value===value){
                item.checked=true;
            }
        }
    });
}

const checkName=(name)=>{
    let nameRegax=RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if(!nameRegax.test(name)) throw 'Name is Incorrect!!!';
}

const checkStartDate=(startDate)=>{
    let now=new Date();
    if(startDate>now) throw'start date is futur date!!!';
    var diff=Math.abs(now.getTime()-startDate.getTime());
    if(diff/(100*60*60*24) > 30)
        throw 'start date is beyond 30';
}
