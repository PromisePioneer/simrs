<?php

namespace App\Http\Controllers\Api\Master\General\Subscriptions;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Services\Master\General\Pricing\Repository\SubscriptionRepository;
use App\Services\Master\General\Pricing\Service\SubscriptionService;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{

    private SubscriptionService $subscriptionService;

    public function __construct()
    {
        $this->subscriptionService = new SubscriptionService();
    }

    public function assignSubs(Request $request)
    {
        $this->subscriptionService->assignSubs($request);
        return response()->json();
    }
}
