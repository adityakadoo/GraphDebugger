#include <bits/stdc++.h>
using namespace std;

int main()
{
    int aaa = 53;
    shared_ptr<pair<int, int>> ptr(new pair<int,int>);
    *ptr = make_pair(aaa,aaa*2);
    cout<<(*ptr).first<<(*ptr).second<<"\n";
    return 0;
}
