import {createRouter, createWebHistory} from 'vue-router'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:'/',
            name:'login',
            component: () => import('../views/Login.vue')
        },
        {
            path:'/appointments',
            name:'appointment',
            component: () => import('../views/Appointments.vue')
        },
        {
            path:'/patients',
            name: 'patients',
            component: () => import('../views/Patients.vue')
        },
        {
            path:'/doctors',
            name: 'doctors',
            component: () => import('../views/Doctors.vue')
        },
        {
            path:'/accounts',
            name: 'accounts',
            component: () => import('../views/Accounts.vue')
        }
    ]
})

export default router