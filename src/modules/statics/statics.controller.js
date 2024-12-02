import { Order } from "../../../database/models/order.model.js"
import { User } from "../../../database/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const getStaticsClient = catchError(async (req, res, next) => {
    // Fetch user
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }

    // Fetch orders for the client
    const orders = await Order.find({ clientId: req.user._id })
        .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false })
        .populate({ path: 'driverId', select: 'name', strictPopulate: false });

    if (!orders || orders.length === 0) {
        return next(new AppError('لا توجد طلبات لهذا العميل', 404));
    }

    // *** 1. Number of Orders ***
    const numberOfOrders = user.numberOfOrders;

    // *** 2. Most Ordered Areas ***
    const areaCounts = orders.reduce((acc, order) => {
        const areaName = order.recieverPosition?.name || 'غير معروف'; // Handle missing names
        acc[areaName] = (acc[areaName] || 0) + 1;
        return acc;
    }, {});

    const mostOrderedAreas = Object.entries(areaCounts).map(([name, count]) => ({
        name,
        count,
    }));

    // *** 3. Most Ordered Drivers ***
    const driverCounts = orders.reduce((acc, order) => {
        if (order.driverId) {
            const driverName = order.driverId.name;
            acc[driverName] = (acc[driverName] || 0) + 1;
        }
        return acc;
    }, {});

    const mostOrderedDrivers = Object.entries(driverCounts).map(([name, count]) => ({
        driverName: name,
        orderCount: count,
    }));

    // *** 4. Most Ordered Times ***
    const periods = {
        "الصباح": { start: "00:00", end: "12:00", count: 0 },
        "منتصف اليوم": { start: "12:01", end: "18:00", count: 0 },
        "المساء": { start: "18:01", end: "24:00", count: 0 },
    };

    const isTimeInRange = (time, start, end) => time >= start && time <= end;

    orders.forEach(order => {
        const goTime = order.goTime; // Assumes `goTime` is in "HH:mm" format
        for (const [period, range] of Object.entries(periods)) {
            if (isTimeInRange(goTime, range.start, range.end)) {
                range.count += 1;
                break;
            }
        }
    });

    const mostOrderedTimes = Object.entries(periods).map(([name, { count }]) => ({
        periodName: name,
        orderCount: count,
    }));

    // Respond with combined results
    res.status(200).json({
        message: 'success',
        status: 200,
        data: {
            numberOfOrders,
            mostOrderedAreas,
            mostOrderedDrivers,
            mostOrderedTimes,
        },
    });
});

const getStaticsDriver = catchError(async (req, res, next) => {
    // Fetch driver (user) data
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('السائق غير موجود', 404));
    }

    // Fetch orders for the driver
    const orders = await Order.find({ driverId: req.user._id })
        .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false })
        .populate({ path: 'clientId', select: 'name', strictPopulate: false });

    if (!orders || orders.length === 0) {
        return next(new AppError('لا توجد طلبات لهذا السائق', 404));
    }

    // *** 1. Number of Orders ***
    const numberOfOrders = user.numberOfOrders;

    // *** 2. Most Ordered Areas ***
    const areaCounts = orders.reduce((acc, order) => {
        const areaName = order.recieverPosition?.name || 'غير معروف'; // Handle missing names
        acc[areaName] = (acc[areaName] || 0) + 1;
        return acc;
    }, {});

    const mostOrderedAreas = Object.entries(areaCounts).map(([name, count]) => ({
        name,
        count,
    }));

    // *** 3. Most Ordered Clients ***
    const clientCounts = orders.reduce((acc, order) => {
        if (order.clientId) {
            const clientName = order.clientId.name;
            acc[clientName] = (acc[clientName] || 0) + 1;
        }
        return acc;
    }, {});

    const mostOrderedClients = Object.entries(clientCounts).map(([name, count]) => ({
        clientName: name,
        orderCount: count,
    }));

    // *** 4. Most Ordered Times ***
    const periods = {
        "الصباح": { start: "00:00", end: "12:00", count: 0 },
        "منتصف اليوم": { start: "12:01", end: "18:00", count: 0 },
        "المساء": { start: "18:01", end: "24:00", count: 0 },
    };

    const isTimeInRange = (time, start, end) => time >= start && time <= end;

    orders.forEach(order => {
        const goTime = order.goTime; // Assumes `goTime` is in "HH:mm" format
        for (const [period, range] of Object.entries(periods)) {
            if (isTimeInRange(goTime, range.start, range.end)) {
                range.count += 1;
                break;
            }
        }
    });

    const mostOrderedTimes = Object.entries(periods).map(([name, { count }]) => ({
        periodName: name,
        orderCount: count,
    }));

    // Respond with combined results
    res.status(200).json({
        message: 'success',
        status: 200,
        data: {
            numberOfOrders,
            mostOrderedAreas,
            mostOrderedClients,
            mostOrderedTimes,
        },
    });
});


//most ordered areas for client
const getMostOrderedAreasClient=catchError(async(req,res,next)=>{
   // Fetch orders for the client and populate `recieverPosition`
   let orders = await Order.find({ clientId: req.user._id })
   .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false });

if (!orders || orders.length === 0) {
   return next(new AppError('لا توجد طلبات لهذا العميل', 404));
}

// Create a map to count occurrences of each `recieverPosition`
const areaCounts = orders.reduce((acc, order) => {
   const areaName = order.recieverPosition?.name || 'غير معروف'; // Handle missing names
   acc[areaName] = (acc[areaName] || 0) + 1; // Increment count for this area
   return acc;
}, {});

// Convert the result to an array of objects for easier usage
const mostOrderedAreas = Object.entries(areaCounts).map(([name, count]) => ({
   name,
   count,
}));

// Respond with the results
res.status(200).json({
   message: 'success',
   status: 200,
   data: {mostOrderedAreas:mostOrderedAreas},
});
})  

// get most ordered driver
const getMostOrderedDriver=catchError(async(req,res,next)=>{
    // Fetch orders and populate the `driverId` field
    let orders = await Order.find({ clientId: req.user._id })
    .populate({ path: 'driverId', select: 'name', strictPopulate: false });

if (!orders || orders.length === 0) {
    return next(new AppError('لا يوجد طلبات', 404));
}

// Count occurrences of each driver
const driverCount = {};
orders.forEach(order => {
    if (order.driverId) {
        const driverName = order.driverId.name;
        driverCount[driverName] = (driverCount[driverName] || 0) + 1;
    }
});

// Format the response
const mostOrderedDrivers = Object.entries(driverCount).map(([name, count]) => ({
    driverName: name,
    orderCount: count,
}));

res.status(200).json({
    message: 'success',
    status: 200,
    data: {mostOrderedDrivers:mostOrderedDrivers},
});
})

// get most times client
const getMostTimesClient = catchError(async (req, res, next) => {
    // Fetch orders for the client
    let orders = await Order.find({ clientId: req.user._id });

    if (!orders || orders.length === 0) {
        return next(new AppError('لا يوجد طلبات', 404));
    }

    // Define time periods
    const periods = {
        "الصباح": { start: "00:00", end: "12:00", count: 0 },
        "منتصف اليوم": { start: "12:01", end: "18:00", count: 0 },
        "المساء": { start: "18:01", end: "24:00", count: 0 }
    };

    // Helper to compare time strings (HH:mm format)
    const isTimeInRange = (time, start, end) => {
        return time >= start && time <= end;
    };

    // Count occurrences of each period
    orders.forEach(order => {
        const goTime = order.goTime; // Assumes `goTime` is in "HH:mm" format

        for (const [period, range] of Object.entries(periods)) {
            if (isTimeInRange(goTime, range.start, range.end)) {
                range.count += 1;
                break;
            }
        }
    });

    // Format the response
    const mostOrderedTimes = Object.entries(periods).map(([name, { count }]) => ({
        periodName: name,
        orderCount: count,
    }));

    res.status(200).json({
        message: 'success',
        status: 200,
        data: {mostOrderedTimes:mostOrderedTimes},
    });
});

const getNumsOfOrder=catchError(async(req,res,next)=>{
    let user=await User.findById(req.user._id)
    res.status(200).json({message:"success",status:200,data:{numberOfOrders:user.numberOfOrders}})
})
//most ordered areas for driver
const getMostOrderedAreasDriver=catchError(async(req,res,next)=>{
    // Fetch orders for the client and populate `recieverPosition`
    let orders = await Order.find({ driverId: req.user._id })
    .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false });
 
 if (!orders || orders.length === 0) {
    return next(new AppError('لا توجد طلبات ', 404));
 }
 
 // Create a map to count occurrences of each `recieverPosition`
 const areaCounts = orders.reduce((acc, order) => {
    const areaName = order.recieverPosition?.name || 'غير معروف'; // Handle missing names
    acc[areaName] = (acc[areaName] || 0) + 1; // Increment count for this area
    return acc;
 }, {});
 
 // Convert the result to an array of objects for easier usage
 const mostOrderedAreas = Object.entries(areaCounts).map(([name, count]) => ({
    name,
    count,
 }));
 
 // Respond with the results
 res.status(200).json({
    message: 'success',
    status: 200,
    data: {mostOrderedAreas:mostOrderedAreas},
 });
 })  



// get most ordered client
const getMostOrderedClient=catchError(async(req,res,next)=>{
    let orders = await Order.find({ driverId: req.user._id })
    .populate({ path: 'clientId', select: 'name', strictPopulate: false });

if (!orders || orders.length === 0) {
    return next(new AppError('لا يوجد طلبات', 404));
}

// Count occurrences of each 
const clientCount = {};
orders.forEach(order => {
    if (order.clientId) {
        const clientName = order.clientId.name;
        clientCount[clientName] = (clientCount[clientName] || 0) + 1;
    }
});

// Format the response
const mostOrderedClients = Object.entries(clientCount).map(([name, count]) => ({
    clientName: name,
    orderCount: count,
}));

res.status(200).json({
    message: 'success',
    status: 200,
    data: {mostOrderedClients:mostOrderedClients},
});
})

// get most times driver
const getMostTimesDriver = catchError(async (req, res, next) => {
    // Fetch orders for the 
    let orders = await Order.find({ driverId: req.user._id });

    if (!orders || orders.length === 0) {
        return next(new AppError('لا يوجد طلبات', 404));
    }

    // Define time periods
    const periods = {
        "الصباح": { start: "00:00", end: "12:00", count: 0 },
        "منتصف اليوم": { start: "12:01", end: "18:00", count: 0 },
        "المساء": { start: "18:01", end: "24:00", count: 0 }
    };

    // Helper to compare time strings (HH:mm format)
    const isTimeInRange = (time, start, end) => {
        return time >= start && time <= end;
    };

    // Count occurrences of each period
    orders.forEach(order => {
        const goTime = order.goTime; // Assumes `goTime` is in "HH:mm" format

        for (const [period, range] of Object.entries(periods)) {
            if (isTimeInRange(goTime, range.start, range.end)) {
                range.count += 1;
                break;
            }
        }
    });

    // Format the response
    const mostOrderedTimes = Object.entries(periods).map(([name, { count }]) => ({
        periodName: name,
        orderCount: count,
    }));

    res.status(200).json({
        message: 'success',
        status: 200,
        data: {mostOrderedTimes:mostOrderedTimes},
    });
});

export{
    getNumsOfOrder,getMostOrderedAreasClient,getMostOrderedAreasDriver,getMostOrderedDriver,
    getMostOrderedClient,getMostTimesClient,getMostTimesDriver,getStaticsClient,getStaticsDriver
}