# DBMSL Practical Exam 2025–26 Solutions

## Table Structures Used

### EMP Table

| EMPNO | ENAME  | JOB       | DEPTNO | MGR  | HIREDATE   | SAL  | COMM |
| ----- | ------ | --------- | ------ | ---- | ---------- | ---- | ---- |
| 7369  | SMITH  | CLERK     | 20     | 7902 | 1980-12-17 | 800  | NULL |
| 7499  | ALLEN  | SALESMAN  | 30     | 7698 | 1981-02-20 | 1600 | 300  |
| 7521  | WARD   | SALESMAN  | 30     | 7698 | 1981-02-22 | 1250 | 500  |
| 7566  | JONES  | MANAGER   | 20     | 7839 | 1981-04-02 | 2975 | NULL |
| 7654  | MARTIN | SALESMAN  | 30     | 7698 | 1981-10-28 | 1250 | 1400 |
| 7698  | BLAKE  | MANAGER   | 30     | 7839 | 1981-05-01 | 2850 | NULL |
| 7782  | CLARK  | MANAGER   | 10     | 7839 | 1981-06-09 | 2450 | NULL |
| 7788  | SCOTT  | ANALYST   | 20     | 7566 | 1982-12-09 | 3000 | NULL |
| 7839  | KING   | PRESIDENT | 10     | NULL | 1981-11-17 | 5000 | NULL |
| 7844  | TURNER | SALESMAN  | 30     | 7698 | 1981-10-08 | 1500 | NULL |
| 7876  | ADAMS  | CLERK     | 20     | 7788 | 1983-01-03 | 1100 | NULL |
| 7900  | JAMES  | CLERK     | 30     | 7698 | 1981-12-03 | 950  | NULL |
| 7902  | FORD   | ANALYST   | 20     | 7566 | 1981-12-04 | 3000 | NULL |
| 7934  | MILLER | CLERK     | 10     | 7782 | 1982-01-23 | 1300 | NULL |

---

### DEPT Table

| DEPTNO | DNAME      | LOC       |
| ------ | ---------- | --------- |
| 10     | accounting | new yourk |
| 20     | reserch    | dallas    |
| 30     | sales      | chicago   |
| 40     | operations | boston    |

---

### PROJECT Table

| PRONO | PNAME | BUDGET | DEPTNO |
| ----- | ----- | ------ | ------ |
| 1     | se it | 5000   | 10     |
| 2     | te it | 6000   | 20     |
| 3     | be it | 8000   | 30     |

---

# Q1. Trigger on DEPT1 and EMP1

## Create Tables

```sql
create table emp1 as
select * from emp;

create table dept1 as
select * from dept;
```

## Create Trigger

```sql
delimiter //

create trigger trg_delete_emp
after delete on dept1
for each row
begin
    delete from emp1
    where deptno = old.deptno;
end;
//

delimiter ;
```

---

# Q2. Trigger to Update TOTALSAL

## Create TOTALSAL Table

```sql
create table totalsal as
select deptno, sum(sal) as sal
from emp
group by deptno;
```

## Create EMP1 Table

```sql
create table emp1 as
select * from emp;
```

## Create Trigger

```sql
delimiter //

create trigger trg_update_totalsal
after update on emp1
for each row
begin
    update totalsal
    set sal = sal - old.sal + new.sal
    where deptno = old.deptno;
end;
//

delimiter ;
```

---

# Q3. Cursor Program

## Create EMP1 Table

```sql
create table emp1 as
select * from emp
where 1=0;
```

## Create Procedure

```sql
delimiter //

create procedure insert_dept_emp(in dno int)
begin

    declare done int default 0;

    declare v_empno int;
    declare v_ename varchar(20);
    declare v_job varchar(20);
    declare v_deptno int;
    declare v_mgr int;
    declare v_hiredate date;
    declare v_sal int;
    declare v_comm int;

    declare cur cursor for
    select * from emp
    where deptno = dno;

    declare continue handler for not found
    set done = 1;

    open cur;

    read_loop: loop

        fetch cur into
        v_empno, v_ename, v_job,
        v_deptno, v_mgr,
        v_hiredate, v_sal, v_comm;

        if done = 1 then
            leave read_loop;
        end if;

        insert into emp1
        values(
            v_empno, v_ename, v_job,
            v_deptno, v_mgr,
            v_hiredate, v_sal, v_comm
        );

    end loop;

    close cur;

end;
//

delimiter ;
```

## Execute Procedure

```sql
call insert_dept_emp(20);
```

---

# Q4. Procedures

## I. Procedure to Update Salary

```sql
create table emp1 as
select * from emp;
```

```sql
delimiter //

create procedure update_salary(in eno int)
begin

    declare s int;

    select sal into s
    from emp1
    where empno = eno;

    if s < 3000 then

        update emp1
        set sal = 3000
        where empno = eno;

    else

        update emp1
        set sal = sal + sal * 0.10
        where empno = eno;

    end if;

end;
//

delimiter ;
```

## Execute

```sql
call update_salary(7369);
```

---

## II. Procedure to Insert Employee into EMP1

```sql
create table emp1 as
select * from emp
where 1=0;
```

```sql
delimiter //

create procedure insert_employee(in eno int)
begin

    insert into emp1
    select *
    from emp
    where empno = eno;

end;
//

delimiter ;
```

## Execute

```sql
call insert_employee(7369);
```

---

# Q5. Functions

## I. Function to Find Total Salary

```sql
create table emp1 as
select * from emp;
```

```sql
delimiter //

create function total_salary(dno int)
returns int
deterministic

begin

    declare ts int;

    select sum(sal)
    into ts
    from emp1
    where deptno = dno;

    return ts;

end;
//

delimiter ;
```

## Execute

```sql
select total_salary(20);
```

---

## II. Function to Count Employees

```sql
delimiter //

create function total_employee(dno int)
returns int
deterministic

begin

    declare c int;

    select count(*)
    into c
    from emp1
    where deptno = dno;

    return c;

end;
//

delimiter ;
```

## Execute

```sql
select total_employee(20);
```

---

# Q6. Views

## I. Create EMP1 Table

```sql
create table emp1 as
select * from emp;
```

---

## II. Create View DEPT20

```sql
create view dept20 as
select *
from emp1
where deptno = 20;
```

---

## III. Update View

```sql
update dept20
set comm = comm + 100
where comm is not null;
```

---

## IV. Delete Record from View

```sql
delete from dept20
where empno = 7369;
```

---

## V. Create View with CHECK OPTION

```sql
create view dept30 as
select *
from emp1
where deptno = 30
with check option;
```

---

## VI. Insert into View

```sql
insert into dept30
values(
73,
'akash',
'clerk',
20,
7902,
'1980-12-17',
800,
null
);
```

### Result:

Error because DEPTNO is not 30.

---

## VII. Create Join View

```sql
create view empview as
select
e.empno,
e.ename,
e.sal,
e.deptno,
d.dname
from emp1 e
join dept d
on e.deptno = d.deptno;
```

---

## VIII. Drop View EMPVIEW

```sql
drop view empview;
```

---

## IX. Drop View DEPT20

```sql
drop view dept20;
```

---

## X. Drop View DEPT30

```sql
drop view dept30;
```

---

# Q7. SQL Queries

## I. Display Managers

```sql
select *
from emp
where job = 'MANAGER';
```

---

## II. Employees with NULL Commission

```sql
select *
from emp
where comm is null;
```

---

## III. Salary Between 1000 and 3000

```sql
select *
from emp
where sal between 1000 and 3000;
```

---

## IV. Employee Names Ending with S

```sql
select *
from emp
where ename like '%S';
```

---

## V. Sort Employees by Salary Descending

```sql
select *
from emp
order by sal desc;
```

---

## VI. Minimum Salary in Department 20

```sql
select min(sal)
from emp
where deptno = 20;
```

---

## VII. Total Salary of Department 10

```sql
select sum(sal)
from emp
where deptno = 10;
```

---

## VIII. Department Wise Total Salary

```sql
select deptno, sum(sal)
from emp
group by deptno;
```

---

## IX. Inner Join of EMP and DEPT

```sql
select
e.empno,
e.ename,
e.sal,
d.deptno,
d.dname,
d.loc
from emp e
join dept d
on e.deptno = d.deptno;
```

---

## X. Right Join of EMP and DEPT

```sql
select
e.empno,
e.ename,
e.sal,
d.deptno,
d.dname,
d.loc
from emp e
right join dept d
on e.deptno = d.deptno;
```

---

# Q8. Advanced SQL Queries

## I. Employee and Manager Names

```sql
select
e.ename as employee,
m.ename as manager
from emp e
left join emp m
on e.mgr = m.empno;
```

---

## II. Employee Number and Manager Name

```sql
select
e.empno,
e.ename,
m.ename as manager
from emp e
left join emp m
on e.mgr = m.empno;
```

---

## III. Self Join

```sql
select
e.ename as employee,
m.ename as manager
from emp e
left join emp m
on e.mgr = m.empno;
```

---

## IV. UNION Example

```sql
select job
from emp
where deptno = 10

union

select job
from emp
where deptno = 20;
```

---

## V. Employees in Dept 20 Earning Above Average

```sql
select *
from emp
where deptno = 20
and sal >
(
    select avg(sal)
    from emp
    where deptno = 20
);
```

---

## VI. Employees Earning Above Department Average

```sql
select *
from emp e
where sal >
(
    select avg(sal)
    from emp
    where deptno = e.deptno
);
```

---

## VII. Employees Hired Before Their Managers

```sql
select
e.ename as employee,
m.ename as manager
from emp e
join emp m
on e.mgr = m.empno
where e.hiredate < m.hiredate;
```

---

## VIII. MINUS Operation (MySQL Alternative)

```sql
select distinct job
from emp
where deptno = 10
and job not in
(
    select job
    from emp
    where deptno = 20
);
```

---

## IX. Correlated Subquery

```sql
select *
from emp e
where sal >
(
    select avg(sal)
    from emp
    where deptno = e.deptno
);
```

---

## X. Employee Names Containing Two A's

```sql
select *
from emp
where ename like '%A%A%';
```

---

# Q9. DDL Commands

## I. Create EMP1 Table

```sql
create table emp1 as
select * from emp;
```

---

## II. Add GRADE Column

```sql
alter table emp1
add grade varchar(10);
```

---

## III. Drop GRADE Column

```sql
alter table emp1
drop column grade;
```

---

## IV. Add Primary Key

```sql
alter table emp1
add constraint EMPNO_P
primary key(empno);
```

---

## V. Drop Primary Key

```sql
alter table emp1
drop primary key;
```

---

## VI. Add CHECK Constraint

```sql
alter table emp1
add constraint SAL_C
check(sal > 100);
```

---

## VII. Modify SAL Column

```sql
alter table emp1
modify sal int(14);
```

---

## VIII. Add Default Value

```sql
alter table student
modify ename varchar(20)
default 'unknown';
```

---

## IX. Remove Default Value

```sql
alter table student
alter ename drop default;
```

---

## X. Drop SAL Column

```sql
alter table emp1
drop column sal;
```
