let empPayrollList;
window.addEventListener('DOMContentLoaded',(event)=>{
     empPayrollList=getEmployeePayrollDataFromStorage();
     document.querySelector(".emp-count").textContent=empPayrollList.length;
     createInnerHtml();
     localStorage.removeItem("editEmp")
    if(site_Properties.use_local_storage.match("true")){
        getEmployeePayrollDataFromStorage();
    }else{
        getEmployeePayrollDataFromStorage();
    }
    
});

const processEmployeePayrollDataResponse=()=>{
    document.querySelector(".emp-count").textContent=empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp')
}

const getEmployeePayrollDataFromStorage=()=>{
    return localStorage.getItem('EmployeePayrollList')?
                            JSON.parse(localStorage.getItem('EmployeePayrollList')):[];

    processEmployeePayrollDataResponse();
}

const getEmployeePayrollDataFromServer=()=>{
    makeServiceCall("Get",site_Properties.server_url,true)
    .then(responseText=>{
        empPayrollList=JSON.parse(responseText);
        processEmployeePayrollDataResponse();
    })
    .catch(error=>{
        console.log("Get Error State: ",+JSON.stringify(error));
        empPayrollList=[];
        processEmployeePayrollDataResponse();
    });
}

const createInnerHtml=() => {
    const headerHtml="<th></th><th>Name</th><th>Gender</th><th>Department</th><th>salary</th><th>start Date</th><th>Actions</th>";
    if(empPayrollList.length==0)return;
    let innerHtml=`${headerHtml}`;
    //var EmployeepayrollList=EmployeePayrollJson();
    // UC5
    for(const Data of empPayrollList){
        innerHtml=`${innerHtml}
            <tr>
                <td><img class="profile" src="${Data._name}" alt=""></td>
                <td>
                    ${Data._name}
                </td>
                <td>
                    ${Data._gender}
                </td>
                <td>
                ${Data._department}
                </td>
                <td>${Data._salary}</td>
                <td>${Data._startDate}</td>
                <td>
                    <button id="${Data.id}" onclick="remove(${Data.id})" alt="delete">Delete</button> 
                    <button onclick="update(${Data.id})" alt="update">Update</button> 
                </td>
            </tr>
        `;
    }
    document.querySelector('#display').innerHTML=innerHtml;
}

// const EmployeePayrollJson=()=>{
//     let EmployeePayrollLocalList=[
//         {
//             _name:'aakash potdar',
//             _gender:'male',
//             _department:['HR',' Accounts'],
//             _salary:'40000',
//             _startDate:'20th feb,2021',
//             _note:'',
//             id:new Date().getTime(),
//             _prfilePic:'12.jpg'
//         },
//         {
//             _name:'sfwas sdccr',
//             _gender:'Female',
//             _department:'HR',
//             _salary:'40550',
//             _startDate:'19th feb,2021',
//             _note:'',
//             id:new Date().getTime(),
//             _prfilePic:'../34.jpg'
//         }
//     ];
//     return EmployeePayrollLocalList;
// };

const getDeptHtml=(deptList) => {
    let depHtml='';
    for(const dept of deptList){
        depHtml=`${depHtml}<div class='dept-label'>${dept}</div>`
    }
    return depHtml;
};

const remove=(node)=>{
    let employeeData=empPayrollList.find(emp=>emp.id==node);
    if(!employeeData) return;
    const index=empPayrollList
                .map(emp=>employeeData.id)
                .indexOf(employeeData.id);
    empPayrollList.splice(index,1);
    localStorage.setItem("EmployeePayrollList",JSON.stringify(empPayrollList));
    document.querySelector(".emp-count").textCount=empPayrollList.length;
    createInnerHtml();
}
