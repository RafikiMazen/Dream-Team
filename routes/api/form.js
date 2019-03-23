const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require("../../models/User")
const Form = require('../../models/Form')
const formEnum=require('../../enums/formStatus')
const validator = require('../../validations/formValidations')
const typesEnum=require('../../enums/accountType')

//READ ALL FORMS
router.get('/', async (req,res) => {
    const form = await Form.find()
    res.json({data: form})
})
//As a reviewer i should be able to accept or reject applications  and add a comment to be viewed by lawyer when reviewer rejects the form
 // we merged 6.2 and 6.3 to be more efficient
 
 router.put('/reviewer/accept/:idform/:idrev',async(req,res)=>{
    const idform = req.params.idform
    const idrev = req.params.idrev
        const form = await Form.findById(idform)
        if(!form) 
            return res.status(404).send({error: 'Form does not exist'})
        if(idrev==form.reviewer) {  
        await Form.findByIdAndUpdate(idform,{formStatus:formEnum.formStatus.PAYMENT})
        await Form.findByIdAndUpdate(idform,{reviewerDecision:1})}
        else{
          res.json({msg: 'not the same reviewer'})
        }
         
        res.json({msg: 'Form status is updated successfully'})
  
  })
  router.put('/reviewer/reject/:idform/:idrev',async(req,res)=>{
        const idform = req.params.idform
        const idrev = req.params.idrev
        const form = await Form.findById(idform)
        if(!form) 
            return res.status(404).send({error: 'Form does not exist'})
            if(form.reviewer==idrev){
        await Form.findByIdAndUpdate(idform,{formStatus:formEnum.formStatus.LAWYER})
        await Form.findByIdAndUpdate(idform,{reviewerDecision:-1,reviwerComment:req.body.reviwerComment})}
        else{
          res.json({msg: 'not the same reviewer'})
        }
        res.json({msg: 'Form status is updated successfully'})
  
  })  
 //CREATE FORM BY LAWYER
// router.post('/lawyer/:id', async (req,res) => {
   
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const form = await Form.findById(id);
        if (!form)
            return res.status(404).send({
                error: "This Form does not exist"
            });
        res.json({
            data: form
        });
    } catch (err) {
        res.json({
            msg: err.message
        });
    }
})
//CREATE 
router.post('/lawyer/:id', async (req,res) => {
   
    try {
        const lawyerId = req.params.id
        var isValidated = validator.createValidation(req.body)
          if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
          const reqBody=req.body
          body: Object.assign(reqBody, {
            lawyer:lawyerId,
            lawyerDecision:1,
            formStatus:formEnum.formStatus.REVIEWER
          })
        const newForm = await Form.create(req.body)
        res.json({msg:'Form was created successfully ', data: newForm})}
        catch(error){
            console.log(error)
        }
        
 })
 router.post('/investor/:id', async (req,res) => {
   
    try {
      const investorId = req.params.id
        var isValidated = validator.createValidation(req.body)
          if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
          const reqBody=req.body
          body: Object.assign(reqBody, {
            investor:investorId,
            formStatus:formEnum.formStatus.LAWYER
          })
        const newForm = await Form.create(req.body)
        res.json({msg:'Form was created successfully ', data: newForm})}
        catch(error){
            console.log(error)
        }
        
 })

//GET BY Form ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const form = await Form.findById(id);
        if (!form)
            return res.status(404).send({
                error: "This Form does not exist"
            });
        res.json({
            data: form
        });
    } catch (err) {
        res.json({
            msg: err.message
        });
    }
})

//UPDATE FORM BY ID
router.put('/:id', async (req,res) => {
        try {
         const id = req.params.id
         const form = await Form.findById(id)
         if(!form) return res.status(404).send({error: 'Form does not exist'})
         var isValidated = validator.updateValidation(req.body)
         if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
         const updatedForm = await Form.findByIdAndUpdate(id,req.body)
         res.json({msg: 'Form updated successfully'})
        }
        catch(error) {
            // We will be handling the error later
            console.log(error)
        }  
        
    })
    

//DELETE FORM BY ID        
router.delete('/:id', async (req,res) => {
    try {
    const id = req.params.id
    const deletedForm = await Form.findByIdAndRemove(id)
    res.json({msg:'Form was deleted successfully', data: deletedForm})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
})

//to get undecided forms for lawyer or reviwer
router.get('/undecidedForms/:loggedintype', async (req, res) => {
 const loggedintype = req.params.loggedintype

 if(loggedintype===typesEnum.accountTypes.LAWYER){
   var forms = await Form.find({"lawyerDecision": 0 })
   res.json({
     data: forms
   })
 }
 else if(loggedintype===typesEnum.accountTypes.REVIEWER){
   var forms = await Form.find({"reviewerDecision": 0 })
   res.json({
     data: forms
   })
 }



else return res.status(404).send({
 error: "you are not allowed to perform the requested operation"
})})

//to get form status for any lawyer or reviewer or admin or specific investor to track his forms
router.get("/formStatus/:loggedintype/:id", async (req, res) => {
 const loggedintype = req.params.loggedintype
 const id = req.params.id

 if(loggedintype===typesEnum.accountTypes.INVESTOR){
   var forms = await Form.find({"investor": id })
   res.json({
     data: forms
   })
 }
 else if(loggedintype===typesEnum.accountTypes.REVIEWER||loggedintype===typesEnum.accountTypes.LAWYER||loggedintype===typesEnum.accountTypes.ADMIN){
   const forms = await Form.find();
   res.json({
     data: forms
   })
 }
 else return res.status(404).send({
   error: "you are not allowed to perform the requested operation"
 })

});

// 6.3 As a reviewer I should view all forms that I have approved/rejected

router.get("/:type/AR/:id", async (req, res) => 
{
   const type = req.params.type
   const id = req.params.id
   const user = await User.findById(id);
       if (!user)
           return res.status(404).send({
               error: "This User does not exist"
           });
    const dec = await Form.find(({"reviewerDecision": 1 } || {"reviewerDecision": -1 }));       
   if(type===typesEnum.accountTypes.REVIEWER && dec){
     
   const form = await Form.find({"reviewer": id }&& ({"reviewerDecision": 1 } || {"reviewerDecision": -1 }));

   res.json({ data: form });}
   else res.json({ msg: "No Forms for this reviewer "});
   
   
 });
// 5.3 Add comment to Form by lawyer after rejection
router.put("/:idform/:idlawyer", async (req, res) => {
 
   const id = req.params.idform;
   const idlaw = req.params.idlawyer;
   const form = await Form.findById(id);
   if (!form) return res.status(404).send({ error: "Form does not exist" });
   // const isValidated = validator.updateValidation(req.body)
   // if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
   //const lawform = await Form.find({"lawyer": idlaw ,"lawyerDecision": -1  })
  //const dec = await Form.find(( {"lawyerDecision": -1 }));
  var forms = await Form.findOne({"lawyerDecision": -1 ,"lawyer": idlaw ,"_id":id}) 
  // if((form.lawyerDecision==-1)&&(form.lawyer==idlaw)){
   if(forms){
   //const updatedForm = await Form.findByIdAndUpdate(id, req.body)
   const updatedForm = await Form.findOneAndUpdate({"lawyerDecision": -1,"lawyer": idlaw ,"_id":id } ,req.body)
   res.json({ msg: "Form updated successfully" })}
   else res.json({ msg: "No Forms for this lawyer "});

});

//As a Lawyer I should view all forms that I have approved/rejected
router.get("/lawyer/:id", async (req, res) => 
{
   const id = req.params.id
   const user = await User.findById(id);
       if (!user)
           return res.status(404).send({
               error: "This User does not exist"
           })
    // const lawyerForm1 = await Form.findById(id,{"lawyerDecision": 1}) 
    // const lawyerForm2 = await Form.findById(id, {"lawyerDecision": -1 })
    const lawyers = await Form.find({"lawyer":id})       
  
       res.json({ data: lawyers })
    
})
//As a Lawyer i should be able to accept or reject applications
router.put('/lawyer/:lawyerId/accept/:id',async(req,res)=>{
  const id = req.params.id
  const lawyerId = req.params.id
  const lawyer = await Form.findById(lawyerId)
      if(!lawyer) 
          return res.status(404).send({error: 'lawyer does not exist'})
      const form = await Form.findById(id)
      if(!form) 
          return res.status(404).send({error: 'Form does not exist'})
      await Form.findByIdAndUpdate(id,{formStatus:formEnum.formStatus.REVIEWER})
      await Form.findByIdAndUpdate(id,{lawyerDecision:1})
      res.json({msg: 'Form status is updated successfully'})

})
router.put('/lawyer/reject/:id',async(req,res)=>{
  const id = req.params.id
      const form = await Form.findById(id)
      if(!form) 
          return res.status(404).send({error: 'Form does not exist'})
      await Form.findByIdAndUpdate(id,{formStatus:formEnum.formStatus.INVESTOR})
      await Form.findByIdAndUpdate(id,{lawyerDecision:-1})
      res.json({msg: 'Form status is updated successfully'})
})


//Investor(Investor created form), lawyer(Investors' form forwarded to lawyer), Reviewer , Payment , Approved ENUM (FORM STATUS ENUM)
        //User Story 4.2 , investor vieweing pending companies
        router.get('/pending/:id', async (req, res) => {
            const id = req.params.id
            const forms =await Form.find({investor:id, formStatus: {$ne:formEnum.formStatus.APPROVED}})
               res.json({
           data: forms
       })
      })
       //User Story 4.3, investor vieweing running companies
       router.get('/running/:id', async (req, res) => {
        
        const id = req.params.id
        const forms= await Form.find({investor:id, formStatus:formEnum.formStatus.APPROVED })
          res.json({
            data: forms
        })
       

})
     
// Sprint 2 User Story 2.2
var SSC = [
    ["قواعد التحقق", "اختیارات القائمة", "اجباري", "نوع الحقل", "اسم الحقل"],
    ["", "سیتم عرضهم من قاعدة البیانات", "نعم", "قائمة", "القانون المنظم"],
    ["", "سیتم عرضهم من قاعدة البیانات", "نعم", "قائمة", "شكل الشركة القانوني"],
    ["قواعد التحقق", "اختیارات القائمة", "جباري", "نوع الحقل", "اسم الحقل"],
    ["", "", "", "", "اسم الشركة"],
    ["-", "", "نعم", "نص", "اسم الشركة"],
    ["", "", "لا", "نص", "سم الشركة بالإنجلیزیة في حالة وجوده"],
    ["", "", "", "", "بیانات المركز الرئیسي وموقع ممارسة النشاط"],
    [
      "",
      "سیتم عرضهم من قاعدة البیانات",
      "نعم",
      "قائمة",
      "(المركز الرئیسي (المحافظة"
    ],
    [
      "",
      "سیتم عرضهم من قاعدة البیانات",
      "نعم",
      "قائمة",
      "(لمركز الرئیسي(المدینة"
    ],
    ["", "", "نعم", "نص", "(المركز الرئیسي(العنوان"],
    ["", "", "لا", "نص", "التلیفون"],
    ["", "", "لا", "الفاكس"],
    ["", "", "", "", "البیانات المستثمر"],
    ["", "", "", "", "البیانات المالیة"],
    ["", "سیتم عرضهم من قاعدة البیانات", "نعم", "قائمة", "عملة رأس المال"],
    [
      "لا یقل مبلغ رأس المال عن 50,000 جنیه هذه القاعدة قابلة للتغیر یسمح الحقل بـ12 رقم كحد اقصى",
      "",
      "نعم",
      "رقم",
      "رأس المال"
    ],
    ["", "", "", "", "المستثمر"],
    ["", "", "نعم", "نص", "الاسم"],
    ["", "شخص", "", "قائمة", "نوع المستثمر"][
      ("یظهر في حالة أن نوع المستثمر:- شخص",
      "یتم عرضها من قاعدة البیانات",
      "یتم عرضها من قاعدة البیانات",
      "",
      "قائمة",
      "الجنس")
    ],
    [
      "یظهر في كل الحالات",
      "یتم عرضها من قاعدة البیانات",
      "نعم",
      "قائمة",
      "الجنسیة"
    ],
    [
      "في حالة ان المستثمر مصري یجب أن یكون نوع اثبات الشخصیة: رقم قومي یظهر في حالة أن نوع المستثمر:- شخص",
      "یتم عرضها من قاعدة البیانات",
      "نعم",
      "قائمة",
      "نوع اثبات الشخصیة"
    ],
    [
      "في حالة أن نوع اثبات الشخصیة رقم قومي، یجب التأكد من صحة الرقم 14 رقم یظهر في حالة أن نوع المستثمر: - شخص",
      "",
      "نعم",
      "نص",
      "رقم اثبات الشخصیة"
    ],
    [
      "یتم ادخاله تلقائیا في حالة أن نوع اثبات الشخصیة رقم قومي. یجب ألا یقل السن عن21 سنة یظهر في حالة أن نوع المستثمر:- شخص",
      "",
      "نعم",
      "تاریخ",
      "تاریخ المیلاد"
    ],
    ["یظهر في كل الحالات", "", "نعم", "نص", "عنوان الإقامة"],
    ["یظهر في كل الحالات", "-", "لا", "نص", "التلیفون"],
    ["یظهر في كل الحالات", "", "لا", "نص", "الفاكس"][
      ("یظهر في حالة أن نوع الشریك: - شخص - یمثل",
      "",
      "لا",
      "نص",
      "البرید الإلكتروني")
    ],
    ["", "", "", "", "(مجلس المدیرین (جدول"],
    ["", "", "نعم", "نص", "الاسم"],
    ["", "شخص", "نعم", "قائمة", "نوع المستثمر"],
    ["", "یتم عرضها من قاعدة البیانات", "نعم", "قائمة", "الجنس"],
    ["", "یتم عرضها من قاعدة البیانات", "نعم", "قائمة", "الجنسیة"],
    [
      " في حالة ان المستثمر مصري یجب أن یكون نوع اثبات الشخصیة: رقم قومي",
      "یتم عرضها من قاعدة البیانات",
      "نعم",
      "قائمة",
      "نوع اثبات الشخصیة"
    ],
    [
      "في حالة أن نوع اثبات الشخصیة رقم قومي، رقم اثبات الشخصیة نص نعم یجب التأكد من صحة الرقم 14 رقم",
      "",
      "نعم",
      "نص",
      "رقم اثبات الشخصیة"
    ],
    [
      "یتم ادخاله تلقائیا في حالة أن نوع اثبات لشخصیة رقم قومي. یجب ألا یقل السن عن21 سنة",
      "",
      "نعم",
      "تاریخ",
      "تاریخ المیلاد"
    ],
    ["", "", "نعم", "نص", "عنوان الإقامة"],
    [
      "",
      "یتم عرضها من قاعدة البیانات ",
      "نعم",
      "قائمة",
      "صفة الشخص في مجلس المدیرین"
    ]
  ];
  //$("#DealerDiv").html("<h1>"+ SSC + "</h1>");
  var SPC = [
    ["قواعد التحقق", "اختیارات القائمة", "اجباري", "نوع الحقل", "اسم الحقل"],
    ["", "سیتم عرضهم من قاعدة البیانات", "نعم", "قائمة", "القانون المنظم"],
    ["", "سیتم عرضهم من قاعدة البیانات", "نعم", "قائمة", "شكل الشركة القانوني"],
    ["قواعد التحقق", "اختیارات القائمة", "جباري", "نوع الحقل", "اسم الحقل"], 
    ["", "", "", "", "اسم المنشأة"],
    ["-", "", "نعم", "نص", "اسم المنشأة"],
    ["", "", "لا", "نص", "سم الشركة بالإنجلیزیة في حالة وجوده"],
    ["", "", "", "", "بیانات المركز الرئیسي وموقع ممارسة النشاط"],
    [
      "",
      "سیتم عرضهم من قاعدة البیانات",
      "نعم",
      "قائمة",
      "(المركز الرئیسي (المحافظة"
    ],
    [
      "",
      "سیتم عرضهم من قاعدة البیانات",
      "نعم",
      "قائمة",
      "(لمركز الرئیسي(المدینة"
    ],
    ["", "", "نعم", "نص", "(المركز الرئیسي(العنوان"],
    ["", "", "لا", "نص", "التلیفون"],
    ["", "", "لا", "الفاكس"],
    ["", "", "", "", "البیانات المستثمر"],
    ["", "", "", "", "البیانات المالیة"],
    ["", "سیتم عرضهم من قاعدة البیانات", "نعم", "قائمة", "عملة رأس المال"],
    [
      "لا یقل مبلغ رأس المال عن 50,000 جنیه هذه القاعدة قابلة للتغیر یسمح الحقل بـ12 رقم كحد اقصى",
      "",
      "نعم",
      "رقم",
      "رأس المال"
    ],
    ["", "", "", "", "المستثمر"],
    ["", "", "نعم", "نص", "الاسم"],
    ["", "شخص", "", "قائمة", "نوع المستثمر"][
      ("یظهر في حالة أن نوع المستثمر:- شخص",
      "یتم عرضها من قاعدة البیانات",
      "یتم عرضها من قاعدة البیانات",
      "",
      "قائمة",
      "الجنس")
    ],
    [
      "یظهر في كل الحالات",
      "یتم عرضها من قاعدة البیانات",
      "نعم",
      "قائمة",
      "الجنسیة"
    ],
    [
      "في حالة ان المستثمر مصري یجب أن یكون نوع اثبات الشخصیة: رقم قومي یظهر في حالة أن نوع المستثمر:- شخص",
      "یتم عرضها من قاعدة البیانات",
      "نعم",
      "قائمة",
      "نوع اثبات الشخصیة"
    ],
    [
      "في حالة أن نوع اثبات الشخصیة رقم قومي، یجب التأكد من صحة الرقم 14 رقم یظهر في حالة أن نوع المستثمر: - شخص",
      "",
      "نعم",
      "نص",
      "رقم اثبات الشخصیة"
    ],
    [
      "یتم ادخاله تلقائیا في حالة أن نوع اثبات الشخصیة رقم قومي. یجب ألا یقل السن عن21 سنة یظهر في حالة أن نوع المستثمر:- شخص",
      "",
      "نعم",
      "تاریخ",
      "تاریخ المیلاد"
    ],
    ["یظهر في كل الحالات", "", "نعم", "نص", "عنوان الإقامة"],
    ["یظهر في كل الحالات", "-", "لا", "نص", "التلیفون"],
    ["یظهر في كل الحالات", "", "لا", "نص", "الفاكس"][
      ("یظهر في حالة أن نوع الشریك: - شخص - یمثل",
      "",
      "لا",
      "نص",
      "البرید الإلكتروني")
    ],[("", "", "نعم", "نص", "عنوان الإقامة")]
  ];
  //$("#DealerDiv").html("<h2>"+ SPC + "</h2>");
 
  
  
  var SSCandSPC = [
    ["1", "SSC Minimum Capital Limit is 50,000 EGP"],
    [
      "2",
      "SSC Must have at least One Egyptian Manager, In case Founder/Investor is from Foreign Country"
    ],
    [
      "3",
      "SPC Minimum Capital Limit will be 100,000 EGP in case of Foreign Investor Only,Otherwise there is No Capital Limit"
    ],
    ["4", "SSC and SPC can Only have One Investor as their Founder"],
    ["5", "SPC doesn't have any Managers"],
    [
      "6",
      "Both SPC and SSC must have Unique Company Name (Company Names can't be Repeated)"
    ],
    ["7", "SSC can't have the same investor founder to Multiple SSC Companies"],
    ["8", "Each Request must have a Unique auto generated Case ID"],
    [
      "9",
      "A Contract will be Generated for SSC Companies after Lawyer Fills Form. The generated form is in pdf format and this Is the file to be sent to external entities"
    ],
    [
      "10",
      "A Decision will be Generated for SPC Companies after Lawyer Fills Form.The generated form is in pdf format and this Is the file to be sent to external entities"
    ],
    [
      "11",
      "The Lawyer has the option to Regenerate Documents after editing anything in the Form"
    ],
    [
      "12",
      "Fees will be calculated at the Lawyer's Step and Lawyer can Recalculate Fees afterediting the Form"
    ],
    [
      "13",
      "Each Company after the Approval of the Reviewer will have an Electronic Journal(Same as Contract/Decision) and will be displayed in a Separate View at the Portal"
    ],
    [
      "14",
      "The UI of the application forms has to be rendered by a given JSON Object that shows the required fields and their types"
    ],
    ["15", "The System should be available in Arabic and English"]
  ];
  //$("#DealerDiv").html("<h4>"+ SSCandSPC + "</h4>");
  router.get("/SSC", (request, response) => {
    response.send(SSC);
  });
  
  router.get("/SPC", (request, response) => {
    response.send(SPC);
  });
  
  router.get("/SSCandSPC", (request, response) => {
    response.send(SSCandSPC);
  });
  
// Sprint 2 User Story 2.3
  var feesCalculationRules = [
    ["Entity", "Law 159", "Law 72"],
    [
      "GAFI",
      " واحد في الألف من رأس المال الحد الأدنى: 100 الحد الأقصى: 1000",
      "لا یوجد"
    ],
    [
      "الهیئة العامة للاستثمار والمناطق الحرة إیداعات واردة من جهات تتعامل مع البنك المركزي",
      "",
      ""
    ],
    [
      "Notary Public مصلحة الشهر العقاري والتوثیق إیداعات واردة من جهات تتعامل مع البنك المركزي",
      "ربع في المائة من رأس المال الحد الأدنى: 10 الحد الأقصى: 1000",
      "لا یوجد"
    ],
    [
      "Commercial جهاز تنمیة التجارة الداخلیة إیداعات واردة من جهات تتعامل مع البنك المركزي",
      "56 جم مقسم إلى (51 إیرادات + 5 دائنون)",
      "610 جم مقسم إلى (100 إیرادات + 6دائنون)"
    ]
  ];
  router.get("/feesCalculationRules", (request, response) => {
    response.send(feesCalculationRules);
  });

  //Sprint 2 2.1
 
  router.get("/publishedcompanies", async (req, res) => {
    const form = await Form.find({ formStatus: { $nin: [false] } });
    res.json({
      data: form
    });
  });



module.exports = router