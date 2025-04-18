import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Attendance from '../attendance/attendance';
import RecentClasses from '../cards/recentClasses';
import { useSelector } from 'react-redux';
import AssignmentChart from '../teacherdashboard/assignmentgraph';
import AttendanceChart from '../teacherdashboard/teacherattendancegraph';
import DueAssignments from '../dueAssignments/dueAssign';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Performance = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
    const userName = useSelector((state) => state.user.name);
    const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transitionApplied, setTransitionApplied] = useState(false); // To track transition state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/dashboard`,
                    { headers }
                );
                setDashboardData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);  // Ensure loading is set to false even if there's an error
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set transition delay after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setTransitionApplied(true);
        }, 1000); // Apply transition after 2 seconds

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, []);

    if (loading) {
        return (
            <div className={`w-full h-screen flex justify-center items-center`}>
                <p></p> {/* Placeholder or skeleton loader */}
            </div>
        );
    }

    const assignments = dashboardData?.details.joined.assignments || [];
    let completedTotalAssignments = 0;
    let dueSoonTotalAssignments = 0;
    let overdueTotalAssignments = 0;

    assignments.forEach((assignmentGroup) => {
        const totalAssignments = assignmentGroup.assignments.length;
        const completedAssignments = assignmentGroup.assignments.filter(
            (assignment) => assignment.isGraded
        ).length;
        const dueSoonAssignments = assignmentGroup.assignments.filter(
            (assignment) => new Date(assignment.dueDate) > new Date() && !assignment.isGraded
        ).length;
        const overdueAssignments = assignmentGroup.assignments.filter(
            (assignment) => new Date(assignment.dueDate) < new Date() && !assignment.isGraded
        ).length;
        completedTotalAssignments += completedAssignments;
        dueSoonTotalAssignments += dueSoonAssignments;
        overdueTotalAssignments += overdueAssignments;
    });

    const data = {
        labels: ['Assignments'],
        datasets: [
            {
                label: 'Completed Assignments',
                data: [completedTotalAssignments || 0],
                backgroundColor: '#0A5757',
            },
            {
                label: 'Assignments due soon',
                data: [dueSoonTotalAssignments || 0],
                backgroundColor: '#00A8A5',
            },
            {
                label: 'Overdue Assignments',
                data: [overdueTotalAssignments || 0],
                backgroundColor: '#71DBD3',
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { 
                display: true,
                ticks: { color: 'black' },
                barThickness: 15,
            },
            y: {
                beginAtZero: true,
                display: true,
                ticks: { color: 'black', stepSize: 1 },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 30,
    };

    return (
        <div 
            className={` ${isMobile ? 'w-[94%]' : 'w-[65%] pl-1'}`} 
            style={{ 
                marginLeft: isMobile ? '3%' : sidebarWidth,
                transition: transitionApplied ? 'margin-left 0.3s ease' : 'none', // Apply transition after 2 seconds
            }}
        >
            <div className="w-full h-[10%] mt-[70px]">
                <p className="text-[23px] pt-[15px] font-semibold">Hello, {formattedUserName}!</p>
            </div>
            
            <div className={`flex h-[35%] overflow-x-auto ${isMobile ? 'max-h-[300px]' : ''}`}>
                {isEnrolled ? (
                    assignments.length > 0 ? (
                        <div className='w-[55%] h-[100%] min-w-[360px]'>
                            <div className="flex items-center h-[100%] p-4 pt-8 border border-[#BCE2DF] rounded-lg bg-white">
                                <div className="w-[45%] h-[100%]">
                                    <Bar data={data} options={options} />
                                </div>
                                <div className="flex flex-col gap-[40px] w-[55%]">
                                    <ul className={`${isCollapsed ? "items-center" : "ml-[5%]"} text-sm space-y-2 flex flex-col gap-[10px]`}>
                                        <li className="flex items-center">
                                            <span className="w-3 h-3 bg-[#0A5757] mr-2 rounded-sm"></span>
                                            Completed Assignments ({completedTotalAssignments || 0})
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-3 h-3 bg-[#00A8A5] mr-2 rounded-sm"></span>
                                            Assignments due soon ({dueSoonTotalAssignments || 0})
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-3 h-3 bg-[#71DBD3] mr-2 rounded-sm"></span>
                                            Overdue Assignments ({overdueTotalAssignments || 0})
                                        </li>
                                    </ul>
                                    <button className={`${isCollapsed ? "mx-auto" : "ml-[15%]"} mt-4 px-4 py-2 w-[70%] bg-teal-700 text-white rounded-md hover:bg-teal-800`}>
                                        View Analysis
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='w-[55%] border border-[#BCE2DF] rounded-lg bg-white h-[100%] min-w-[360px] flex flex-col items-center justify-center'>
                            <h2 className="text-gray-500 text-xl font-semibold text-center">No assignments to track yet.</h2>
                            <p className="text-gray-500 text-center">Once you complete assignments, performance data will appear here.</p>
                        </div>
                    )
                ) : (
                    <div className='w-[45%] min-w-[360px] h-[100%] '><AssignmentChart /></div>
                )}
                
                {isEnrolled ? (
                    <div className="flex gap-4 ml-[20px] w-[45%] h-[100%] min-w-[360px]">
                        <Attendance averageAttendance={dashboardData?.details.joined.averageAttendance} />
                    </div>
                ) : (
                    <div className='flex gap-4 ml-[20px] w-[55%] h-[100%] min-w-[360px] '><AttendanceChart /></div>
                )}
            </div>
            
            <div className={`flex h-[45%] ${isMobile ? 'flex-col' : ''}`}>
                <RecentClasses recentClasses={dashboardData.user.recentClasses} />
                <DueAssignments />
            </div>
        </div>
    );
};

export default Performance;
