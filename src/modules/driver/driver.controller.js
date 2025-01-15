import { FavDriver } from "../../../database/models/favDriver.js";
import { Order } from "../../../database/models/order.model.js";
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
    const { position, minAge, maxAge, rateAvg, category, online } = req.query;

    // Helper function to convert time (hh:mm) to minutes for comparison
    // const timeToMinutes = (timeStr) => {
    //     if (!timeStr) return null;
    //     const [hours, minutes] = timeStr.split(':').map(Number);
    //     return (hours * 60) + minutes;
    // };

    // // Convert the input `time` to minutes if provided
    // const timeInMinutes = timeToMinutes(time);

    // Build the query object dynamically
    let query = { role: 'driver' };

    if (position) {
        query['position'] = position; // Assumes `position` is an ID
    }
    if (minAge || maxAge) {
        query['age'] = {};
        if (minAge) {
            query['age']['$gte'] = parseInt(minAge, 10); // Filter for minimum age
        }
        if (maxAge) {
            query['age']['$lte'] = parseInt(maxAge, 10); // Filter for maximum age
        }
    }
    if (rateAvg) {
        query['rateAvg'] = { $gte: parseFloat(rateAvg) }; // Filter for minimum average rating
    }
    if (category) {
        query['categoryId'] = category; // Assumes `categoryId` is an ID
    }
    if (online) {
        query['online'] = online;
        }
    // if (timeInMinutes !== null) {
    //     query['$expr'] = {
    //         $and: [
    //             {
    //                 $lte: [
    //                     {
    //                         $add: [
    //                             { $multiply: [{ $toInt: { $substr: ["$startTime", 0, 2] } }, 60] }, // Extract hour
    //                             { $toInt: { $substr: ["$startTime", 3, 2] } } // Extract minute
    //                         ]
    //                     },
    //                     timeInMinutes
    //                 ]
    //             },
    //             {
    //                 $gte: [
    //                     {
    //                         $add: [
    //                             { $multiply: [{ $toInt: { $substr: ["$endTime", 0, 2] } }, 60] }, // Extract hour
    //                             { $toInt: { $substr: ["$endTime", 3, 2] } } // Extract minute
    //                         ]
    //                     },
    //                     timeInMinutes
    //                 ]
    //             }
    //         ]
    //     };
    // }

    // Execute the query with the appropriate population
    
    let users = await User.find(query)
        .populate({
            path: 'myReviews',
            select: 'comment rate client',
        })
        .populate({ path: 'categoryId', select: 'name', strictPopulate: false })
        .populate({ path: 'position', select: 'name', strictPopulate: false })
        .populate({ path: 'village', select: 'name', strictPopulate: false });

        if (users.length === 0) {
            return res.status(200).json({
                message: 'لا يوجد سائقين ',
                status: 200,
                data: { users: [] }
            });
        }

    res.status(200).json({ message: 'success', status: 200, data: { users } });
});


const getDriversRate = catchError(async (req, res, next) => {
    const { position, minAge, maxAge, rateAvg, category, online } = req.query;

    // Build the query object dynamically
    let query = { rateAvg: { $ne: null } ,role:'driver'}; // Ensure only users with a valid `rateAvg` are included

    if (position) {
        query['position'] = position; // Assumes `position` is an ID
    }
    if (minAge || maxAge) {
        query['age'] = {};
        if (minAge) {
            query['age']['$gte'] = parseInt(minAge, 10); // Filter for minimum age
        }
        if (maxAge) {
            query['age']['$lte'] = parseInt(maxAge, 10); // Filter for maximum age
        }
    }
    if (rateAvg) {
        query['rateAvg'] = { $gte: parseFloat(rateAvg) }; // Filter for minimum average rating
    }
    if (category) {
        query['categoryId'] = category; // Assumes `categoryId` is an ID
    }
    if (online) {
        query['online'] = online;
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

        if (users.length === 0) {
            return res.status(200).json({
                message: 'لا يوجد سائقين ',
                status: 200,
                data: { users: [] }
            });
        }

    res.status(200).json({ message: 'success', status: 200, data: { users } });
});

const getFavDrivers = catchError(async (req, res, next) => {
    // Extract filters from the query parameters
    const { position, minAge, maxAge, rateAvg, category, online } = req.query;

    // Build the filter object for drivers
    const driverFilter = { role: 'driver' }; // Ensure we're filtering only drivers

    // Apply position filter if provided
    if (position) {
        driverFilter.position = position;
    }

    // Apply age filter if provided
    if (minAge || maxAge) {
        query['age'] = {};
        if (minAge) {
            query['age']['$gte'] = parseInt(minAge, 10); // Filter for minimum age
        }
        if (maxAge) {
            query['age']['$lte'] = parseInt(maxAge, 10); // Filter for maximum age
        }
    }

    // Apply rateAvg filter if provided
    if (rateAvg) {
        driverFilter.rateAvg = { $gte: parseFloat(rateAvg) }; // Filter for minimum average rating
    }

    // Apply category filter if provided
    if (category) {
        driverFilter.categoryId = category;
    }

    // Apply online status filter if provided
    if (online !== undefined) {
        driverFilter.online = online === 'true'; // Convert the `online` query parameter to a boolean
    }

    // Query the favorite drivers and apply the filters to the populated `driver` field
    let users = await FavDriver.find()
        .populate({
            path: 'driver',
            match: driverFilter, // Apply filters here
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

    // Filter out any `users` where the `driver` field is null after applying `match`
    users = users.filter(f => f.driver !== null);

    if (users.length === 0) {
        return res.status(200).json({
            message: 'لا يوجد سائقين ',
            status: 200,
            data: { users: [] }
        });
    }

    res.status(200).json({ message: 'success', status: 200, data: { users } });
});


//start order  driver not available
const startOrder = catchError(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $set: { available: false ,online:false} },{new:true}

        );
    // Update the related order with status and driverId
        await Order.findByIdAndUpdate(
            { _id: req.body.orderId },
            { $set: { status: 'current'} }
        );    
        res.status(200).json({ message: "تم بدء الرحلة", status:200,data:{user} });
    
});
const changeOnline = catchError(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $set: { online:req.body.online} },{new:true}

        );
   
        res.status(200).json({ message: "تم تغيير الحالة", status:200,data:{user} });
    
});


export{
    getDriversRate,getDrivers,getFavDrivers,startOrder,changeOnline
}