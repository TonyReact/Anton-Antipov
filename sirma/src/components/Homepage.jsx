import React, { useState } from "react";
import Papa from "papaparse";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const Homepage = () => {

  const [firstemp, setFirstemp] = useState([]);
	
  const [secondemp, setSecondemp] = useState([]);

  const [projdays, setProjdays] = useState([]);

  const [name, setName] = useState([]);
  	
  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");
	
  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");
		
    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      // let filename = e.target.files[0].name;
      // setName(filename)
			
      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
	return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };
	
  const handleParse = () => {
		
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();
		
    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: false });
      const parsedData = csv?.data;
      const formatedData = parsedData.map((data) => Object.values(data) )
      showResult(formatedData);
    };
    reader.readAsText(file);
  };

  function showResult(formatedData) {
    const
     oneDay  = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
   , setDate = YMD =>
      {
        let [Y,M,D] = YMD.split('-').map(Number)
        return new Date(Y,--M,D)
      }

    // group Employees by project id , change date string to JS newDate
    const Proj_Emps = formatedData.reduce( (r,[EmployeeID, ProjectID, StartDate, EndDate])=>
      {
        let startDay = setDate(StartDate)
        , endDay = EndDate ? setDate(EndDate) :  new Date()
        r[ProjectID] = r[ProjectID] ?? []
        r[ProjectID].push({EmployeeID,startDay,endDay})
        return r
      }, {})

    // combination of pairs of employees per project
    let combination = {}
    for (let proj in Proj_Emps) 
    for (let i = 0; i < Proj_Emps[proj].length - 1; i++) 
    for (let j = i + 1; j < Proj_Emps[proj].length; j++) 
      {
        let employeeA = Proj_Emps[proj][i]
        let employeeB = Proj_Emps[proj][j]

        if (( employeeA.endDay <= employeeB.endDay && employeeA.endDay > employeeB.startDay )
          ||( employeeB.endDay <= employeeA.endDay && employeeB.endDay > employeeA.startDay )
        ){
          const 
            firstDate    = employeeA.startDay > employeeB.startDay ? employeeA.startDay : employeeB.startDay
          , secondDate   = employeeA.endDay < employeeB.endDay ? employeeA.endDay : employeeB.endDay
          , days = Math.ceil((secondDate - firstDate) / oneDay)
          , key  = `${employeeA.EmployeeID}-${employeeB.EmployeeID}`
            ;
          combination[key] = combination[key] ?? { employeeA: employeeA.EmployeeID, employeeB: employeeB.EmployeeID, sum:0, details:[] }
         combination[key].details.push({proj: Number(proj), days })
         combination[key].sum += days
        }
      }
  
    const result  =  
      Object.entries(combination)
      .sort((a,b)=> b[1].sum - a[1].sum )
      .map(([k,v])=>v)

     const employeeOne = result.map(el =>  Array.from(el.employeeA))
     const employeeTwo = result.map(el =>  Array.from(el.employeeB))
     const details     = result.map(el =>  Array.from(JSON.stringify(Object.values(el.details[0])).replaceAll('[','').replaceAll(']','').replaceAll(',','-')))
  
     setFirstemp(employeeOne)
     setSecondemp(employeeTwo)
     setProjdays(details)
  };

  return (
	 <>
	   <section>
	     <div id="scroll-container">
	       <div id="scroll-text">Click on the Select button and check the result. Have fun!</div>
	     </div>
	     <main>
	       <div className="area" >
	         <ul className="circles">
		   <li></li>
		   <li></li>
		   <li></li>
		   <li></li>
		   <li></li>
		   <li></li>
		   <li></li>
		   <li></li>
		   <li></li>
		   <li></li>
		 </ul>
 	       </div >
	       <div className="form-box">
	         <div className="file-input">
		   <input onChange={handleFileChange}
				id="csvInput"
				name="file"
				type="File"
				accept=".csv"
				className="file" />
		   <label htmlFor="csvInput">
		     Select file
		   </label>
		 </div>
		 <div className="text-box">
		   <button className="btn" onClick={handleParse}>Parse</button>
		 </div>
	       </div>
	       <div className="container">
	         <div className="title-container">
		   <ul>
		     <li>Employee ID #1</li>
		     <li>Employee ID #2</li>
		     <li>Project ID & Days worked</li>
		   </ul>
		 </div>
		 <div className="wrapper">
		   <div className="box__item">
		   {error ? error : firstemp.map((item,
		   index) => <div className="item" key={index}>{item}</div>)	
		   }
		 </div>
		 <div className="box__item">
		   {error ? error : secondemp.map((item,
		   index) => <div className="item" key={index}>{item}</div>)
		   }
		 </div>
		 <div className="box__item">
		   {error ? error : projdays.map((item,
		   index) => <div className="item" key={index}>{item}</div>)
		   }
		 </div>
	       </div>
  	     </div>
	   </main>
 	 </section>
       </>
	);
};

export default Homepage;
