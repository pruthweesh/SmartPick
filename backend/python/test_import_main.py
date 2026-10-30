import sys, os
sys.path.append(os.getcwd())
try:
    import main
    print('Import succeeded')
except Exception as e:
    print('Import failed:', e)

