import { FavDriver } from "../../../database/models/favDriver.js";
import { Notification } from "../../../database/models/notification.model.js";
import { Order } from "../../../database/models/order.model.js";
import { User } from "../../../database/models/user.model.js";
import { sendNotification, validateFCMToken } from "../../../public/js/firebase.js"
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
        // .populate({ path: 'village', select: 'name', strictPopulate: false });

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
        // .populate({ path: 'village', select: 'name', strictPopulate: false });

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
    let user = await User.findByIdAndUpdate(req.user._id, { available: false, online: false }, { new: true });

    await Order.findByIdAndUpdate(req.body.orderId, { status: "current" });

    // Notify client
    const order = await Order.findById(req.body.orderId);
    if (order && order.clientId) {
        const client = await User.findById(order.clientId);
        if (client && client.fcmToken) {
            const isValid = await validateFCMToken(client.fcmToken);
            if (isValid) {
                const title = "طلبك بدأ";
                const body = "السائق في طريقه إليك.";
                const from=order.driverId;
                const sent = await sendNotification(client.fcmToken, title, body);
                if (sent) await Notification.create({ userId: client._id, title, body ,from });
            } else {
                console.warn(`Invalid FCM token for client: ${client._id}`);
            }
        }
    }

    res.status(200).json({ message: "تم بدء الرحلة", status: 200, data: { user } });
});


// const startOrder = catchError(async (req, res, next) => {
//     let user = await User.findByIdAndUpdate(
//             { _id: req.user._id },
//             { $set: { available: false ,online:false} },{new:true}

//         );
//     // Update the related order with status and driverId
//         await Order.findByIdAndUpdate(
//             { _id: req.body.orderId },
//             { $set: { status: 'current'} }
//         );    
//         res.status(200).json({ message: "تم بدء الرحلة", status:200,data:{user} });
    
// });
const changeOnline = catchError(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $set: { online:req.body.online} },{new:true}

        );
   
        res.status(200).json({ message: "تم تغيير الحالة", status:200,data:{user} });
    
});

const getDriversForClient = catchError(async (req, res, next) => {
    const { position, minAge, maxAge, rateAvg, category, online } = req.query;

    const clientId = req.user._id; 

    // Fetch client to get favorite drivers
    const client = await User.findById(clientId).select("favorites");
    if (!client) return res.status(200).json({
        message: 'لا يوجد عميل ',
        status: 200,
        data: { users: [] }
    });

    let query = { rateAvg: { $ne: null } ,role:'driver',online:true};

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

    // Fetch drivers ordered by rating
    const users = await User.find(query)
    .sort({ rateAvg: -1 }) // Sort by `rateAvg` in descending order
    .populate({
        path: 'myReviews',
        select: 'comment rate client',
    })
    .populate({ path: 'categoryId', select: 'name', strictPopulate: false })
    .populate({ path: 'position', select: 'name', strictPopulate: false })
    .populate({ path: '', select: 'name', strictPopulate: false });
// .find({ role: "driver" })
//       .sort({ rateAvg: -1 }) // Order by highest rating
//       .select("name rateAvg profileImg")
//       .lean();

    // Add `isFavorite` flag for each driver
    const favoriteDrivers = new Set(client.favorites.map((id) => id.toString()));
    users.forEach((driver) => {
      driver.isFavorite = favoriteDrivers.has(driver._id.toString());
    });

    if (users.length === 0) {
        return res.status(200).json({
            message: 'لا يوجد سائقين ',
            status: 200,
            data: { users: [] }
        });
    }
    res.status(200).json({ message: 'success', status: 200, data: { users } });
  
});
const changeFav = catchError(async (req, res, next) => {
    const clientId = req.user._id;
    const { driverId } = req.params;

    // Ensure the driver exists
    const driver = await User.findOne({ _id: driverId, role: "driver" });
    if (!driver) return res.status(404).json({ message: "لا يوجد سائق" });

    // Check if the driver is already in the client's favorites
    const client = await User.findById(clientId).select("favorites");
    if (!client) return res.status(404).json({ message: "لا يوجد عميل" });

    const isFavorite = client.favorites.includes(driverId);
    const updateOperation = isFavorite
        ? { $pull: { favorites: driverId } }  // Remove from favorites
        : { $addToSet: { favorites: driverId } }; // Add to favorites (prevents duplicates)

    // Update client's favorites in the database
    await User.findByIdAndUpdate(clientId, updateOperation);

    res.status(200).json({
        message: isFavorite ? "تم الحذف من المفضلة" : "تمت الإضافة للمفضلة",
        status: 200,
        data: []
    });
});


const getMyFav = catchError(async (req, res, next) => {
    const clientId = req.user._id;
    const client = await User.findById(clientId).populate({
        path: "favorites",
        // select: "name rateAvg profileImg",
        
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
            },
            {
                path: 'myReviews',
                select: 'comment rate client',
            }
        ]
      });
  
      if (!client) return res.status(404).json({ message: "لا يوجد عميل" });

      const users = client.favorites.map(driver => ({
        ...driver.toObject(),
        isFavorite: true, // Since we are fetching favorites, all should be true
      }));

      if (users.length === 0) {
        return res.status(200).json({
            message: 'لا يوجد سائقين ',
            status: 200,
            data: { users: [] }
        });
    }
  
      res.status(200).json({message: 'success', status: 200, data: { users }}); // Return favorite drivers list
    });

// add connect for driver 
const addConnect = catchError(async (req, res, next) => {
    const clientId = req.user._id;
    let user = await User.findById(req.params.id);    
    if (!user) {
        return next(new AppError("هذا المستخدم غير موجود", 404));
    }

    // Check if the client already connected before
    if (user.interestedClients?.includes(clientId)) {
        return res.status(400).json({ 
            message: "لقد قمت بالفعل بإضافة هذا السائق إلى قائمة الاتصال الخاصة بك", 
            status: 400 ,
            data: []
        });
    }

    // Update the driver's document by adding clientId to interestedClients
    await User.updateOne(
        { _id: req.params.id },  
        { 
            $inc: { numberOfConnect: 1 }, 
            $addToSet: { interestedClients: clientId }  // Prevents duplicates
        }
    );

    res.status(200).json({ 
        message: "يمكنك الان التواصل مع الكابتن", 
        status: 200,
        data:[]
    });
});


export{
    getDriversRate,getDrivers,getFavDrivers,startOrder,changeOnline,getDriversForClient,changeFav,
    getMyFav,addConnect
}