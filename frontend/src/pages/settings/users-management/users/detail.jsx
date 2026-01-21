import {Loader2, Mail, Building2, UserCircle, ShieldCheck} from 'lucide-react';
import Layout from "@/pages/dashboard/layout.jsx";
import {useUserStore} from "@/store/useUserStore.js";
import {useParams} from "@tanstack/react-router";
import {Badge} from "@/components/ui/badge.jsx";
import {getInitials} from "@/hooks/use-helpers.js";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Card} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {useEffect} from "react";


function UserDetail(opts) {
    const {isLoading, showUser, userValue} = useUserStore();
    const {id} = useParams(opts);


    useEffect(() => {
        showUser(id);
    }, [showUser, id])


    if (isLoading) {
        return (
            <Layout>
                <Card className="p-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-teal-600"/>
                        <span className="ml-3 text-gray-600">Loading user data...</span>
                    </div>
                </Card>
            </Layout>
        );
    }

    if (!userValue) {
        return (
            <Layout>
                <Card className="p-8">
                    <div className="text-center py-12">
                        <UserCircle className="w-12 h-12 mx-auto text-gray-400 mb-3"/>
                        <p className="text-gray-600">User not found</p>
                    </div>
                </Card>
            </Layout>
        );
    }


    return (
        <Layout>
            <Card className="p-0 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="h-32 bg-teal-600 rounded-t-lg"></div>

                <div className="px-6 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
                        <Avatar className=" relative inline-flex w-32 h-32 ring-4 ring-white">
                            {userValue.avatar ? (
                                <AvatarImage className="w-full h-full object-cover rounded-full" src={userValue.avatar}
                                             alt={userValue.name}/>
                            ) : (
                                <AvatarFallback
                                    className="w-full h-full flex items-center justify-center bg-teal-600 text-white text-4xl font-semibold rounded-full">
                                    {getInitials(userValue.name)}
                                </AvatarFallback>
                            )}
                        </Avatar>

                        {/* User Name */}
                        <div className="flex-1 md:mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {userValue.name || 'Unknown User'}
                            </h1>
                            <Badge className="bg-teal-600 text-sm">
                                {userValue.roles[0]?.name}
                            </Badge>
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            className="flex items-start gap-4 p-5 rounded-lg bg-white border-2 border-gray-200 hover:border-teal-600 transition-colors">
                            <div className="mt-1 p-3 bg-teal-50 rounded-lg">
                                <Mail className="w-6 h-6 text-teal-600"/>
                            </div>
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-700 block mb-2">Alamat Email</Label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-gray-900 font-medium">
                                        {userValue.email || 'Not provided'}
                                    </p>
                                    {userValue.email_verified_at && (
                                        <div
                                            className="flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                                            <ShieldCheck className="w-4 h-4"/>
                                            <span className="text-xs font-medium">Verified</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tenant */}
                        <div
                            className="flex items-start gap-4 p-5 rounded-lg bg-white border-2 border-gray-200 hover:border-teal-600 transition-colors">
                            <div className="mt-1 p-3 bg-teal-50 rounded-lg">
                                <Building2 className="w-6 h-6 text-teal-600"/>
                            </div>
                            <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-700 block mb-2">Organization</Label>
                                <p className="text-gray-900 font-medium">
                                    {userValue.tenant?.name || 'Not assigned'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Layout>
    );
}

export default UserDetail;