from django.http import JsonResponse
from django.db import connection


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
