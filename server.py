from flask import Flask, render_template, request, jsonify, redirect
import os
import json

SAVE_DIR = 'saved_data'
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

app = Flask(__name__, template_folder='template/pages', static_folder='template')

@app.route('/')
def index():
    completed_days = []
    in_progress_days = []
    total_goals = 21

    for i in range(1, total_goals + 1):
        filename = os.path.join(SAVE_DIR, f'day_{i}.json')
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            plans = data.get('plans', [])
            if plans:
                if all(plan.get('checked', False) for plan in plans):
                    completed_days.append(i)
                elif any(plan.get('checked', False) == False for plan in plans):
                    in_progress_days.append(i)

    day = request.args.get('day', None)
    data = {}

    if day:
        filename = os.path.join(SAVE_DIR, f'day_{day}.json')
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)

    return render_template('homepage.html',
                           day=day or 'unknown',
                           note_data=data,
                           completed_days=completed_days,
                           in_progress_days=in_progress_days)


@app.route('/getStudyTime')
def get_study_time():
    day = request.args.get('day')
    if not day:
        return jsonify({'error': 'day 값이 필요합니다.'}), 400

    filename = os.path.join(SAVE_DIR, f'day_{day}.json')
    if not os.path.exists(filename):
        return jsonify({'error': '해당 날짜 데이터가 없습니다.'}), 404

    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

    study_time = data.get('studyTime', {'hours': '0', 'minutes': '0'})
    return jsonify({'studyTime': study_time})


@app.route('/createNote', methods=['POST'])
def create_note():
    data = request.get_json()
    day = data.get('day')

    if not day:
        return jsonify({'message': 'day 값이 필요합니다.'}), 400

    filename = f"day_{day}.json"
    filepath = os.path.join(SAVE_DIR, filename)

    # 파일 존재 여부에 따라 페이지 분기
    if os.path.exists(filepath):
        return jsonify({'redirect_url': f'/openNote?day={day}'})
    else:
        return jsonify({'redirect_url': f'/schedule?day={day}'})

@app.route('/openNote')
def open_note():
    day = request.args.get('day', 'unknown')
    filename = os.path.join(SAVE_DIR, f'day_{day}.json')

    data = {}
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)

    return render_template('SchedulerPage.html', day=day, note_data=data)

@app.route('/schedule')
def schedule_page():
    day = request.args.get('day', 'unknown')
    filename = os.path.join(SAVE_DIR, f'day_{day}.json')

    data = {}
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)

    study_time = data.get('studyTime') if data else None
    return render_template('SchedulerPage.html', day=day, study_time=study_time, note_data=data)

@app.route('/saveData', methods=['POST'])
def save_data():
    data = request.get_json(force=True)
    if not data or 'day' not in data:
        return jsonify({'message': 'day 값이 필요합니다.'}), 400

    day = data['day']
    filename = f"day_{day}.json"
    filepath = os.path.join(SAVE_DIR, filename)

    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
    except Exception as e:
        return jsonify({'message': f'파일 저장 실패: {str(e)}'}), 500

    return jsonify({'message': f'{filename} 저장 성공'}), 200

@app.route('/deleteData')
def delete_data():
    day = request.args.get('day')
    if not day:
        return "day 값이 필요합니다.", 400

    filename = f"day_{day}.json"
    filepath = os.path.join(SAVE_DIR, filename)

    try:
        if os.path.exists(filepath):
            os.remove(filepath)
        else:
            return f"{filename} 파일이 존재하지 않습니다.", 404
    except Exception as e:
        return f"파일 삭제 실패: {str(e)}", 500

    return redirect('/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)

