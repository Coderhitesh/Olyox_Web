const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {

        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});


const { registerVendor, verifyVendorEmail, resendOtp, loginVendor, logoutVendor, changeVendorPassword, changeVendorCategory, deleteVendorAccount, updateVendorDetails, getSingleProvider, updatePassword, forgetPassword, getAllVendor, updateVendorIsActive, verifyDocument, copyVendor, getCopyOfProvider, manuallyRegisterVendor, getProviderDetailsByNumber, getProviderDetailsByBhId, updateVendorDetailByAdmin, updateVendorDocument, uploadAdditionalDocImage } = require('../controllers/vendor.controller');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, updateCategoryToggle } = require('../controllers/category.controller');
const { createMembershipPlan, getAllMembershipPlans,getAllMembershipAdminPlans ,getMembershipPlanById, updateMembershipPlan, deleteMembershipPlan, updateMembershipStatus } = require('../controllers/Member_ship.controller');
const { DoRecharge, getMyRecharges, getApprovedRecharge, getAllRecharge, cancelRecharge, getAllOfAnyIdRecharge, assignFreePlan } = require('../controllers/Recharge_controller');
const Protect = require('../middlewares/Protect');
const { createBhId, updateBhId, deleteBhId, toggleStatus, checkBhId, getDetailsViaBh } = require('../controllers/Bh.controller');
const { doReffer, getMyReferral, GetRefrealDetailsBy, getAllReferal } = require('../controllers/Refrreal');
const { createWithdrawal, approveWithdrawal, rejectWithdrawal, cancelWithdrawal, getAllWithdrawals, getWithdrawalById, getPendingWithdrawals, getWithdrawalQueryById, getWithdrawalByVendorId } = require('../controllers/Withdraw.controller');
const { createEnquiry, getAllEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry } = require('../controllers/Enquiry.controller');
const { createCommissionTDS, getSingleCommissionTDS, updateCommissionTDS } = require('../controllers/commissionTDS.Controller');

router.post('/register_vendor', upload.any(), registerVendor);
router.post('/manual_register', manuallyRegisterVendor)


// upload.fields([
//     { name: 'imageone', maxCount: 1 },
//     { name: 'imagetwo', maxCount: 1 }
// ])(req, res, (err) => {
//     if (err) {
//         return res.status(400).json({ error: err.message });
//     }
//     next();
// });

router.post('/verify_document', verifyDocument);
router.post('/verify_email', verifyVendorEmail);
router.post('/resend_Otp', resendOtp);
router.post('/copy-her-id', Protect, copyVendor);
router.put('/update_document/:id', upload.any(), updateVendorDocument);
router.put('/update_addition_document/:id', upload.any(), uploadAdditionalDocImage);




router.post('/login', loginVendor);
router.post('/logout', logoutVendor);
router.post('/change_Vendor_Category', changeVendorCategory);
router.post('/change_Vendor_Password', changeVendorPassword);
router.delete('/delete_account', deleteVendorAccount);
router.put('/update_account/:id', updateVendorDetails);
router.get('/get_Single_Provider/:id', getSingleProvider);
router.get('/get_Copy_Provider/:id', getCopyOfProvider);
router.get('/all_vendor', getAllVendor)
router.put('/update_vendor_status/:id', updateVendorIsActive)
router.put('/update_vendor_detail_by_admin/:id', updateVendorDetailByAdmin)


router.post('/forget-password', forgetPassword);

// router.put('/update_password/:id', updatePassword);

//Recharge Crud ROutes
router.post('/do-recharge', (req, res, next) => {
    if (req.query._id) {
        return DoRecharge(req, res);
    } else {

        return Protect(req, res, () => DoRecharge(req, res));
    }
});
// router.get('/', Protect, getMyRecharges);
router.get('/get-recharge', (req, res, next) => {
    if (req.query._id) {
        return getMyRecharges(req, res);
    } else {
        // Apply Protect middleware
        return Protect(req, res, () => getMyRecharges(req, res));
    }
});


router.get('/get-all-recharge', getAllRecharge)
router.put('/cancel_recharge', cancelRecharge)
router.get('/approve_recharge', getApprovedRecharge)
router.get('/get-all-admin-recharge', getAllOfAnyIdRecharge)
router.put('/free_plan_approve', assignFreePlan)



// Vendor: Create a withdrawal request

router.post('/create-withdrawal', (req, res, next) => {
    if (req.query._id) {
        return createWithdrawal(req, res);
    } else {
        // Apply Protect middleware
        return Protect(req, res, () => createWithdrawal(req, res));
    }
});
// router.post('/create-withdrawal', Protect, createWithdrawal);
router.put('/approve-withdrawal/:id', approveWithdrawal);
router.put('/reject-withdrawal/:id', rejectWithdrawal);
router.put('/cancel-withdrawal/:id', cancelWithdrawal);
router.get('/withdrawals', getAllWithdrawals);
router.get('/admin-withdrawals', getWithdrawalQueryById);
router.get('/get_withdrawal_by_vendor_id/:id', getWithdrawalByVendorId);

router.post('/getProviderDetailsByNumber', getProviderDetailsByNumber);
router.post('/getProviderDetailsByBhId', getProviderDetailsByBhId);


// router.get('/withdrawal', Protect, getWithdrawalById);
// router.get('/withdrawal', Protect, getWithdrawalById);
router.get('/withdrawal', (req, res, next) => {
    if (req.query._id) {
        return getWithdrawalById(req, res);
    } else {
        // Apply Protect middleware
        return Protect(req, res, () => getWithdrawalById(req, res));
    }
});
router.get('/pending-withdrawal', getPendingWithdrawals)

//Create Bh id 
router.get('/create-bh-id', createBhId);
router.post('/check-bh-id', checkBhId);

router.put('/update/:id', updateBhId);
router.post('/delete-id', deleteBhId);
router.post('/toogle-id', toggleStatus);


// do doReffer
router.post('/do-Reffer', Protect, doReffer)
router.get('/get-my-referral', Protect, getMyReferral)
router.get('/get-all-referral', getAllReferal)


router.get('/get-refer-data', GetRefrealDetailsBy)


//  routes for enquiry
router.post('/enquiries', createEnquiry);  // Create an enquiry
router.get('/enquiries', getAllEnquiries);  // Get all enquiries
router.get('/enquiries/:id', getEnquiryById);  // Get a specific enquiry by ID
router.put('/enquiries/:id', updateEnquiry);  // Update an enquiry
router.delete('/enquiries/:id', deleteEnquiry);  // Delete an enquiry


// category CRUD routes
router.post('/categories_create', upload.single('icon'), createCategory);
router.get('/categories_get', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', upload.single('icon'), updateCategory);
router.delete('/categories/:id', deleteCategory);
router.put('/update_category_status/:id', updateCategoryToggle);


// membership plan CRUD routes
router.post('/membership-plans-create', createMembershipPlan);
router.get('/membership-plans', getAllMembershipPlans);
router.get('/membership-plans-admin', getAllMembershipAdminPlans);
router.get('/membership-plans/:id', getMembershipPlanById);
router.put('/membership-plans/:id', updateMembershipPlan);
router.delete('/membership-plans/:id', deleteMembershipPlan);
router.put('/update_membership_status/:id', updateMembershipStatus);

// app routes
router.get('/app-get-details', getDetailsViaBh);

router.post('/create_commission_tds',createCommissionTDS)
router.get('/get_single_commission_tds/:id',getSingleCommissionTDS)
router.put('/update_commission_tds/:id',updateCommissionTDS)


module.exports = router;
