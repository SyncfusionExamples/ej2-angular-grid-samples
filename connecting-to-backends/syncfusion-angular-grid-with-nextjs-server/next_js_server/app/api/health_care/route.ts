import { Predicate } from '@syncfusion/ej2-data';
import { NextResponse, NextRequest } from "next/server";
import { DataManager, Query } from '@syncfusion/ej2-data';
import { doctorDetails } from '../../../data/health_care_Entities';

// CORS headers configuration
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Create a method to send responses with CORS headers
const corsResponse = (body: any, status = 200) => {
    return new NextResponse(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
};

// Handle the preflight request for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { headers: CORS_HEADERS });
}
// Normalize condition string (default to 'and')
const normalize = (condition?: string) => (condition || 'and').toLowerCase();

// Recursively build predicate tree
const buildPredicate = (node: any, ignoreCase: boolean): any =>
    node?.isComplex && node.predicates?.length
        ? node.predicates
            .map((p: Predicate) => buildPredicate(p, ignoreCase))
            .filter(Boolean)
            .reduce((acc: any, cur: any) =>
                acc ? (normalize(node.condition) === 'or' ? acc.or(cur) : acc.and(cur)) : cur, null)
        : (node?.field && node?.operator ? new Predicate(node.field, node.operator, node.value, ignoreCase) : null);

// Apply filtering based on predicates
const performFiltering = (input: any, query: Query) => {
    const filter = Array.isArray(input) ? input[0] : input;
    if (!filter?.predicates?.length) return;
    const ignoreCase = filter.ignoreCase !== undefined ? !!filter.ignoreCase : true;
    const condition = normalize(filter.condition);
    const combined = filter.predicates
        .map((p: Predicate) => buildPredicate(p, ignoreCase))
        .filter(Boolean)
        .reduce((acc: any, cur: any) => acc ? (condition === 'or' ? acc.or(cur) : acc.and(cur)) : cur, null);
    if (combined) query.where(combined);
};

// Helper function: Apply search functionality
const performSearching = (searchParam: any, query: any) => {
    const { fields, key, operator, ignoreCase } = searchParam[0];
    query.search(key, fields, operator, ignoreCase);
};

// Helper function: Apply sorting
const performSorting = (sortArray: any[], query: Query) => {
    for (let i = 0; i < sortArray.length; i++) {
        const { name, direction } = sortArray[i];
        query.sortBy(name, direction);
    }
};

// GET - Retrieve all data
export async function GET(request: NextRequest) {

    const gridStateParam = new URL(request.url).searchParams.get('gridState');
    if (!gridStateParam) {
        return NextResponse.json(
            { error: 'gridState parameter is required', result: [], count: 0 },
            { status: 400 }
        );
    }

    const gridState = JSON.parse(decodeURIComponent(gridStateParam));

    const query = new Query();

    // Filtering
    if (gridState.where && Array.isArray(gridState.where) && gridState.where.length > 0) {
        performFiltering(gridState.where, query);
    }

    // Searching
    if (gridState.search && Array.isArray(gridState.search) && gridState.search.length > 0) {
        performSearching(gridState.search, query);
    }

    // Sorting
    if (gridState.sorted && Array.isArray(gridState.sorted) && gridState.sorted.length > 0) {
        performSorting(gridState.sorted, query);
    }

    // Paging
    if (gridState.take && gridState.take > 0) {
        const skip = gridState.skip || 0;
        const take = gridState.take;
        query.page(skip / take + 1, take);
    }

    // Execute query on data
    const result: object[] = new DataManager(doctorDetails).executeLocal(query);
    const count: number = result.length;

    return corsResponse({ result, count });
}

// PUT - Update an existing data
export async function PUT(request: NextRequest) {
    const body = await request.json();
    if (body.action === 'edit') {
        const doctorIndex = doctorDetails.findIndex(u => u.DoctorId === body.DoctorId);
        if (doctorIndex === -1) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }
        doctorDetails[doctorIndex] = {
            ...doctorDetails[doctorIndex],
            Name: body.Name || doctorDetails[doctorIndex].Name,
            Specialty: body.Specialty || doctorDetails[doctorIndex].Specialty,
            Experience: body.Experience || doctorDetails[doctorIndex].Experience,
            Availability: body.Availability || doctorDetails[doctorIndex].Availability,
            Email: body.Email || doctorDetails[doctorIndex].Email,
            Contact: body.Contact || doctorDetails[doctorIndex].Contact
        };
        return corsResponse(doctorDetails[doctorIndex]);
    }
}

// DELETE - Delete a data
export async function DELETE(request: NextRequest) {
    const body = await request.json();
    if (body.action === 'delete') {
        const doctorID = body[0].DoctorId;
        const doctorIndex = doctorDetails.findIndex(u => u.DoctorId === doctorID);
        if (doctorIndex === -1) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }
        const deletedDoctor = doctorDetails[doctorIndex];
        doctorDetails.splice(doctorIndex, 1);
        return corsResponse({ message: "Doctor deleted" });
    }
}

// POST - Create a new data
export async function POST(request: NextRequest) {
    const body = await request.json();
    if (body.action === 'add') {
        const newDoctor: any = {
            DoctorId: body.DoctorId,
            Name: body.Name,
            Specialty: body.Specialty,
            Experience: body.Experience,
            Availability: body.Availability,
            Email: body.Email,
            Contact: body.Contact
        };
        doctorDetails.push(newDoctor);
        return corsResponse(newDoctor, 201);
    }
}