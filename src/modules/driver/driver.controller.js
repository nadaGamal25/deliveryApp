import { FavDriver } from "../../../database/models/favDriver.js";
import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";

// const getDriversRate = catchError(async (req, res, next) => {
//     let users = await User.find({ rateAvg: { $ne: null } }) // Ensure only users with a valid `rateAvg` are included
//         .sort({ rateAvg: -1 }) // Sort by `rateAvg` in descending order
//         .populate({
//             path: 'myReviews',
//             select: 'comment rate client',
//         })
//         .populate({ path: 'categoryId', select: 'name', strictPopulate: false })
//         .populate({ path: 'position', select: 'name', strictPopulate: false })
//         .populate({ path: 'village', select: 'name', strictPopulate: false });

//     if (!users || users.length === 0) {
//         return next(new AppError('لم يتم العثور على المستخدمين', 404));
//     }

//     res.status(200).json({ message: 'success', status: 200, data: { users } });
// });

// const getDrivers = catchError(async (req, res, next) => {
//     let users = await User.find({ role:'driver' }) 
//         .populate({
//             path: 'myReviews',
//             select: 'comment rate client',
//         })
//         .populate({ path: 'categoryId', select: 'name', strictPopulate: false })
//         .populate({ path: 'position', select: 'name', strictPopulate: false })
//         .populate({ path: 'village', select: 'name', strictPopulate: false });

//     if (!users || users.length === 0) {
//         return next(new AppError('لم يتم العثور على المستخدمين', 404));
//     }

//     res.status(200).json({ message: 'success', status: 200, data: { users } });
// });

const getDrivers = catchError(async (req, res, next) => {
    const { position, age, rateAvg, category, time } = req.query;

    // Helper function to convert time (hh:mm) to minutes for comparison
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours * 60) + minutes;
    };

    // Convert the input `time` to minutes if provided
    const timeInMinutes = timeToMinutes(time);

    // Build the query object dynamically
    let query = { role: 'driver' };

    if (position) {
        query['position'] = position; // Assumes `position` is an ID
    }
    if (age) {
        query['age'] = { $gte: parseInt(age, 10) }; // Filter for minimum age
    }
    if (rateAvg) {
        query['rateAvg'] = { $gte: parseFloat(rateAvg) }; // Filter for minimum average rating
    }
    if (category) {
        query['categoryId'] = category; // Assumes `categoryId` is an ID
    }
    if (timeInMinutes !== null) {
        query['$expr'] = {
            $and: [
                {
                    $lte: [
                        {
                            $add: [
                                { $multiply: [{ $toInt: { $substr: ["$startTime", 0, 2] } }, 60] }, // Extract hour
                                { $toInt: { $substr: ["$startTime", 3, 2] } } // Extract minute
                            ]
                        },
                        timeInMinutes
                    ]
                },
                {
                    $gte: [
                        {
                            $add: [
                                { $multiply: [{ $toInt: { $substr: ["$endTime", 0, 2] } }, 60] }, // Extract hour
                                { $toInt: { $substr: ["$endTime", 3, 2] } } // Extract minute
                            ]
                        },
                        timeInMinutes
                    ]
                }
            ]
        };
    }

    // Execute the query with the appropriate population
    let users = await User.find(query)
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


const getDriversRate = catchError(async (req, res, next) => {
    const { position, age, rateAvg, category, time } = req.query;

    // Helper function to convert time (hh:mm) to minutes for comparison
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours * 60) + minutes;
    };

    // Convert the input `time` to minutes if provided
    const timeInMinutes = timeToMinutes(time);

    // Build the query object dynamically
    let query = { rateAvg: { $ne: null } ,role:'driver'}; // Ensure only users with a valid `rateAvg` are included

    if (position) {
        query['position'] = position; // Assumes `position` is an ID
    }
    if (age) {
        query['age'] = { $gte: parseInt(age, 10) }; // Filter for minimum age
    }
    if (rateAvg) {
        query['rateAvg'] = { $gte: parseFloat(rateAvg) }; // Filter for minimum average rating
    }
    if (category) {
        query['categoryId'] = category; // Assumes `categoryId` is an ID
    }
    if (timeInMinutes !== null) {
        query['$expr'] = {
            $and: [
                {
                    $lte: [
                        {
                            $add: [
                                { $multiply: [{ $toInt: { $substr: ["$startTime", 0, 2] } }, 60] }, // Extract hour
                                { $toInt: { $substr: ["$startTime", 3, 2] } } // Extract minute
                            ]
                        },
                        timeInMinutes
                    ]
                },
                {
                    $gte: [
                        {
                            $add: [
                                { $multiply: [{ $toInt: { $substr: ["$endTime", 0, 2] } }, 60] }, // Extract hour
                                { $toInt: { $substr: ["$endTime", 3, 2] } } // Extract minute
                            ]
                        },
                        timeInMinutes
                    ]
                }
            ]
        };
    }

    // Execute the query with sorting and population
    let users = await User.find(query)
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

const getFavDrivers = catchError(async (req, res, next) => {
    // Extract filters from the query parameters
    const { position, minAge, maxAge, minRate, maxRate, category, startTime, endTime } = req.query;

    // Build the filter object for drivers
    const driverFilter = { role: 'driver' }; // Ensure we're filtering only drivers

    // Apply position filter if provided
    if (position) {
        driverFilter.position = position;
    }

    // Apply age range filter if provided
    if (minAge || maxAge) {
        driverFilter.age = {};
        if (minAge) driverFilter.age.$gte = parseInt(minAge);
        if (maxAge) driverFilter.age.$lte = parseInt(maxAge);
    }

    // Apply rateAvg range filter if provided
    if (minRate || maxRate) {
        driverFilter.rateAvg = {};
        if (minRate) driverFilter.rateAvg.$gte = parseFloat(minRate);
        if (maxRate) driverFilter.rateAvg.$lte = parseFloat(maxRate);
    }

    // Apply category filter if provided
    if (category) {
        driverFilter.categoryId = category;
    }

    // Apply time availability filter if provided (assuming `startTime` and `endTime` are in 'hh:mm' format)
    if (startTime && endTime) {
        driverFilter.startTime = { $lte: startTime };
        driverFilter.endTime = { $gte: endTime };
    }

    // Query the favorite drivers and apply the filters to the populated `driver` field
    let fav = await FavDriver.find()
        .populate({
            path: 'driver',
            match: driverFilter, // Apply filters here
            // select: 'name age profileImg categoryId rateAvg position startTime endTime',
            populate: [
                {
                    path: 'categoryId', // Populates the `categoryId` field within `driver`
                    select: 'name',
                    strictPopulate: false
                },
                {
                    path: 'position', // Populates the `position` field within `driver`
                    select: 'name',
                    strictPopulate: false
                }
            ]
        })
        .populate({ path: 'client', select: 'name', strictPopulate: false });

    // Filter out any `fav` where the `driver` field is null after applying `match`
    fav = fav.filter(f => f.driver !== null);

    if (!fav || fav.length === 0) {
        return next(new AppError('لم يتم العثور على السائقين المفضلين', 404));
    }

    res.status(200).json({ message: 'success', status: 200, data: { fav } });
});

//start order  driver not available
const startOrder = catchError(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $set: { available: false} },{new:true}

        );
        res.status(200).json({ message: "تم بدء الرحلة", status:200,data:{user} });
    
});


export{
    getDriversRate,getDrivers,getFavDrivers,startOrder
}