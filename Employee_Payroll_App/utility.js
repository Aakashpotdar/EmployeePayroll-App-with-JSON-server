const StringifyDate=(date)=>{
    const options={day:'numeric',month:'short',year:'numeric'};
    const newDate=!date ? "undefined":
        new Date(Date.parse(date)).toLocalDateString('en-GB',options);
    return newDate;
}