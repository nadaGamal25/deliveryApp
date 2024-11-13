import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";

const getDriversRate = catchError(async (req, res, next) => {
    let users = await User.find({ rateAvg: { $ne: null } }) // Ensure only users with a valid `rateAvg` are included
        .sort({ rateAvg: -1 }) // Sort by `rateAvg` in descending order
        .populate({
            path: 'myReviews',
            select: 'comment rate client',
        })
        .populate({ path: 'categoryId', select: 'name', strictPopulate: false })
        .populate({ path: 'position', select: 'name', strictPopulate: false })
        .populate({ path: 'village', select: 'name', strictPopulate: false });

    if (!users || users.length === 0) {
        return next(new AppError('لم يتم العثور على المستخدمين', 404));
    }

    res.status(200).json({ message: 'success', status: 200, data: { users } });
});

const getDriversSearch = catchError(async (req, res, next) => {
    // Initialize ApiFeatures instance with the User model and request query parameters
    let apiFeatures = new ApiFeatures(User.find(), req.query);
    
    // Call search method without await if it is not returning a Promise
    apiFeatures.search();
    
    // Execute the query after applying the filters
    let users = await apiFeatures.mongooseQuery
        .populate({
            path: 'myReviews',
            select: 'comment rate client',
        })
        .populate({ path: 'categoryId', select: 'name', strictPopulate: false })
        .populate({ path: 'position', select: 'name', strictPopulate: false })
        .populate({ path: 'village', select: 'name', strictPopulate: false });

    // Check if no users were found
    if (!users || users.length === 0) {
        return next(new AppError('لم يتم العثور على المستخدمين', 404));
    }

    // Return the list of users found
    res.status(200).json({ message: 'success', status: 200, data: { users } });
});
 








export{
    getDriversRate,getDriversSearch 
}