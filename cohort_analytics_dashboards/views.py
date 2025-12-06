from django.http import JsonResponse
from django.db import connection


def health_check(request):
    """Health check endpoint for Render"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Cohort Analytics API is running',
        'endpoints': [
            '/api/cohorts/',
            '/api/funnel/',
            '/api/products/',
            '/api/segments/',
            '/api/users/',
        ]
    })


def cohort_analysis(request):
    """API endpoint for cohort retention data"""
    query = """
    SELECT 
        cohort_date,
        week_0,
        week_1,
        week_2,
        week_3,
        week_4
    FROM cohort_retention
    ORDER BY cohort_date;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return JsonResponse(results, safe=False)


def funnel_analysis(request):
    """API endpoint for conversion funnel data"""
    query = """
    SELECT 
        step,
        users,
        percentage
    FROM conversion_funnel
    ORDER BY 
        CASE step
            WHEN 'Page View' THEN 1
            WHEN 'Add to Cart' THEN 2
            WHEN 'Checkout' THEN 3
            WHEN 'Purchase' THEN 4
        END;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return JsonResponse(results, safe=False)


def top_products(request):
    """API endpoint for top products data"""
    query = """
    SELECT 
        name,
        category,
        revenue,
        units
    FROM top_products
    ORDER BY revenue DESC
    LIMIT 8;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return JsonResponse(results, safe=False)


def user_segments(request):
    """API endpoint for user segments data"""
    query = """
    SELECT 
        segment_name,
        user_count,
        percentage,
        color
    FROM user_segments
    ORDER BY percentage DESC;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return JsonResponse(results, safe=False)


def high_value_users(request):
    """API endpoint for high value users data"""
    segment_filter = request.GET.get('segment', 'all')
    
    if segment_filter == 'all':
        query = """
        SELECT 
            user_id,
            name,
            email,
            purchases,
            ltv,
            segment,
            last_purchase
        FROM high_value_users
        ORDER BY ltv DESC;
        """
        params = []
    else:
        query = """
        SELECT 
            user_id,
            name,
            email,
            purchases,
            ltv,
            segment,
            last_purchase
        FROM high_value_users
        WHERE segment = ?
        ORDER BY ltv DESC;
        """
        params = [segment_filter]
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return JsonResponse(results, safe=False)
